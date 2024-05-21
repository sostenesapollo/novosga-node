import { prisma } from "@/db.server";
import { getUser } from "@/session.server";
import type { PutObjectCommandInput } from "@aws-sdk/client-s3";
import { S3Client } from "@aws-sdk/client-s3";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { delCachedData, presetValues } from "./utils/utils";
import { v4 as uuid } from "uuid";

const { STORAGE_ACCESS_KEY, STORAGE_SECRET, STORAGE_REGION, STORAGE_BUCKET } =
  process.env;

const client = new S3Client({
  region: STORAGE_REGION || "",
  credentials: {
    accessKeyId: STORAGE_ACCESS_KEY || "",
    secretAccessKey: STORAGE_SECRET || "",
  },
});

const uploadStreamToS3 = async (
  b64: string,
  filename: string,
  type: string
) => {
  const buf = Buffer.from(
    b64.replace(/^data:image\/\w+;base64,/, ""),
    "base64"
  );

  const filetUUID = uuid();
  const getExtension = filename?.slice(
    ((filename.lastIndexOf(".") - 1) >>> 0) + 2
  );
  const fName = filetUUID + "." + getExtension;

  const params: PutObjectCommandInput = {
    Bucket: STORAGE_BUCKET,
    Key: fName,
    Body: buf,
    ACL: "public-read",
    ContentType: type,
  };

  await client.send(new PutObjectCommand(params));

  return fName;
};

export const action = async ({ request, context }: any) => {
  const body = await request.json();

  let newImageUrl;

  // TODO: store images into s3
  if (body.imageUrl) {
    newImageUrl = body.imageUrl;
  } else {
    newImageUrl = await uploadStreamToS3(
      body.fileBase64,
      body.filename,
      body.type
    );
  }

  const user = await getUser(request);
  console.log("Body id:", body.id);

  if (body.id) {
    await prisma.product.update({
      where: {
        // company_id: presetValues(user).company_id,
        id: body.id,
      },
      data: {
        image_url: newImageUrl,
      },
    });
  } else {
    console.log(
      "Update company, id:",
      presetValues(user).company_id,
      "newImageUrl:",
      newImageUrl
    );

    await prisma.company.update({
      where: {
        id: presetValues(user).company_id,
      },
      data: {
        profile_image_url: newImageUrl,
      },
    });
    try {
      console.log("Removendo cache da empresa");
      await delCachedData("company-settings", user, context);
    } catch (e) {
      console.log("Erro ao remover cache", e);
    }
  }

  return newImageUrl;
};
