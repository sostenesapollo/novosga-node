import { Label } from "@radix-ui/react-dropdown-menu";
import { CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Separator } from "../ui/separator";
import { CategorySelection } from "./fields/category-selection";
import { signal } from "@preact/signals-react";
import { useSignals } from "@preact/signals-react/runtime";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { IsEntranceSelection } from "./fields/is-entrance-select";
import { createMoneyFlow } from "@/api/money-flow";
import { notify } from "../generic/snackbar";

const emptyMoneyFlow = {money_flow_category_id: null as string | null | undefined, description: '', value: 0, is_entrance: false}
export type moneyFlowType = typeof emptyMoneyFlow

export const moneyFlow = signal<typeof emptyMoneyFlow | null>(null);

export default function MoneyFlow() {
    useSignals()

    const submit = () => {
        createMoneyFlow(moneyFlow.value).then(()=>{
            moneyFlow.value = null;
            notify.success('Criado com sucesso.')
        }).catch(()=>{
            notify.error('Erro ao criar.')
        })
    }

    return (
        <span className="p-2 w-full overflow-auto">
            <CardHeader className="p-1">
                <CardTitle className="text-primary flex items-center pb-3 pt-1">
                    Adicionar movimentação de caixa
                </CardTitle>
            </CardHeader>

            <Separator className="mb-2"/>

            <CategorySelection/>

            <section>
                <Label>Descrição</Label>
                <Textarea
                    value={moneyFlow.value?.description}
                    autoFocus={true}
                    className="bg-primary-foregruond"
                    placeholder="Descrição da atualização de caixa"
                    onChange={(e: any) => { moneyFlow.value = {...moneyFlow.value, description: e.target.value } as any}}
                />
            </section>

            <section className="flex pt-2 space-x-2">
                <div>
                    <Label>Valor</Label>
                    <Input
                        type="number"
                        value={moneyFlow.value?.value}
                        className="bg-primary-foregruond"
                        placeholder="R$ 0,00"
                        onKeyDown={(e)=>{
                            if(e.key === 'Enter') submit()
                        }}
                        onChange={(e) => { moneyFlow.value = {...moneyFlow.value, value: parseFloat(e.target.value) } as any}}
                    />
                </div>
                <IsEntranceSelection/>                
            </section>

            <div className="flex flex-row fllex-grow">
                <Button variant="outline" className="mt-2 w-full mr-1" onClick={()=>moneyFlow.value=null}>
                    Fechar
                </Button>
                <Button className="mt-2 w-full" onClick={submit}>
                    Criar movimentação
                </Button>
            </div>
        </span>
    )
}