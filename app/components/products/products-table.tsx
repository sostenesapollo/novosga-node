import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {products, selectedProduct} from "@/routes/dashboard.products";
import { useSignals } from "@preact/signals-react/runtime";
import { CircleWithImage } from "../generic/circle-with-image";
import { localMoney } from '@/lib/utils/currency';
import { Separator } from "../ui/separator";

export function ProductsTable() {
  useSignals();

  function onClickRow(product) {
      selectedProduct.value = product;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
            <TableHead className="pl-5">#</TableHead>
            <TableHead>Produto</TableHead>
            <TableHead>Quantidade</TableHead>
            <TableHead>Valor</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.value?.map((product, key) => (
          <TableRow key={key} className="group hover:bg-secondary cursor-pointer" onClick={()=>onClickRow(product)}>
              <TableCell className="font-medium">
                  <CircleWithImage image={product.image_url}/>
              </TableCell>
              <TableCell className="font-medium">{product.product_name}</TableCell>
            <TableCell className="md:p-1 text-center whitespace-nowrap text-md text-base font-medium text-primary bg-primary-foreground">
                {product.is_returnable && product.container_id ? (
                  <span className="flex flex-col">
                    <span className="flex gap-2">
                      <span>
                        <p className="text-xs pt-1">Cheios</p>
                        {product.full}
                      </span>
                      <Separator orientation="vertical" />
                      <span>
                        <p className="text-xs pt-1">Vazios</p>
                        {product.empty}
                      </span>
                      <Separator orientation="vertical" />

                      <span>
                        <p className="text-xs pt-1">Total</p>
                        {product.total}
                      </span>
                    </span>
                  </span>
                ):(
                  <>
                    {product.full}
                  </>
                )}
            </TableCell>
            <TableCell>{localMoney(product.price)}</TableCell>
            {/*<TableCell>{product.product_id}</TableCell>*/}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
