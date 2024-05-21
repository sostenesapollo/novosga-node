import { Avatar, AvatarImage } from "../ui/avatar";

export const defaultProductImage = "https://pedegasfiles.s3.amazonaws.com/62d75f61-f8e8-4e5f-9ea1-d72b439bfb1a.png";

export const CircleWithImage = ({ image }: { image: string }) => (
  <Avatar>
    <AvatarImage src={image || defaultProductImage}/>
  </Avatar>
);
