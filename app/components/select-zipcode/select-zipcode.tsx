import { useEffect, useRef, useState } from "react";
import { notify } from "../generic/snackbar";
import { Icons } from "../icons/icons";
import InputMask from "react-input-mask";
import { signal } from "@preact/signals-react";
import { useSignalEffect, useSignals } from "@preact/signals-react/runtime";

const data = signal({} as any);
const loading = signal(false);

export function SelectZipcode() {
  // useSignalEffect(() => {
  //   if (data.peek().zipcode?.length === 8) {
  //     console.log(`Buscar pelo cep: ${data.peek().zipcode}`);
  //     loading.value = true;

  //     getAddressUsingZipcode(data.peek().zipcode)
  //       .then((result) => {
  //         window.location.href =
  //           "/n/o?state=" +
  //           result.data.state +
  //           "&city=" +
  //           result.data.city +
  //           "&zipcode=" +
  //           data.peek().zipcode;
  //       })
  //       .catch((e) => {
  //         notify("Erro ao buscar cep, tente novamente.", { type: "error" });
  //       })
  //       .finally(() => {
  //         loading.value = false;
  //       });
  //   }
  // });

  return (
    <div className="relative flex w-full items-center justify-end">
      <Icons.MagnifyIcon className="absolute left-0 ml-2 w-8 pr-1 text-muted-foreground" />
      <InputMask
        disabled={loading.value}
        value={data.value.zipcode}
        placeholder="Digite o seu CEP para valores"
        type="tel"
        mask="99999-999"
        className={`w-full rounded-md border-0 bg-transparent py-1.5 pb-3 pl-12 pr-3 pt-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6`}
        onChange={(e: any) => {
          data.value = {
            ...data.value,
            zipcode: e.target.value?.replace(/\D/g, ""),
          };
        }}
      />
      {loading && (
        <div className="pl-2">
          <Icons.loadingIcon />
        </div>
      )}
    </div>
  );
}
