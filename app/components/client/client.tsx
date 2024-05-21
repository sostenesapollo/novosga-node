import { Label } from "@radix-ui/react-dropdown-menu";
import { CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Separator } from "../ui/separator";
import { signal } from "@preact/signals-react";
import { useSignals } from "@preact/signals-react/runtime";
import { Button } from "../ui/button";
import { notify } from "../generic/snackbar";
import { createClient, updateClient } from "@/api/clients";
import AddressAutocomplete from "../generic/autocomplete/address/address-autocomplete";
import NeighborhoodAutocomplete from "../generic/autocomplete/address/neighborhood-autocomplete";
import CityAutocomplete from "../generic/autocomplete/address/city-autocomplete";
import { order } from "../orders/order";
import { orders } from "../orders/orders-table";
import { ordersFiltered } from "@/routes/dashboard.orders";

export const emptyClient = {
    id: undefined as any,
    name: undefined  as string | undefined,
    phone: undefined as string | undefined,
    block: undefined as string | undefined,
    number: undefined as string | undefined,
    reference: undefined as string | undefined,
    phone2: undefined as string | undefined,
    zipcode: undefined as string | undefined,
    cpf_cnpj: undefined as string | undefined,
    fantasy_name: undefined as string | undefined,
    whatsapp: undefined as string | undefined,
    street_id: undefined as string | undefined,
    neighborhood_id: undefined as string | undefined,
    neighborhood_name: undefined as string | undefined, // Just for display inside of neighborhhod autocomplete
}
export type clientType = typeof emptyClient

export const client = signal<typeof emptyClient | null>(null);

export default function Client() {
    useSignals()

    const submit = () => {
        if(client.value?.id) {
            updateClient(client.value).then((updatedClient)=>{
                client.value = null;
                notify.success('Atualizado com sucesso.')

                console.log('updated', updatedClient);
                
                order.value = {
                    ...order.value,
                    client_id: updatedClient.id,
                    client_name: updatedClient.name,
                    Client: updatedClient
                }

            }).catch((e)=>{
                notify.error(e.response?.data?.error || 'Erro ao atualizar.')
            })
        } else {
            createClient(client.value).then((createdClient)=>{
                client.value = null;
                notify.success('Criado com sucesso.')

                console.log(createdClient.id);
                
                order.value = {
                    ...order.value,
                    client_id: createdClient.id,
                    client_name: createdClient.name
                }
            }).catch((e)=>{
                notify.error(e.response?.data?.error || 'Erro ao criar.')
            })
        }
    }

    return (
        <span className="p-2 w-full overflow-auto">
            <CardHeader className="p-1">
                <CardTitle className="text-primary flex items-center pb-3 pt-1">
                    {client.value?.id ? 'Modificar Cliente' : 'Adicionar Cliente'}
                </CardTitle>
            </CardHeader>

            <Separator className="mb-2"/>

            <section>
                <Label>Nome do cliente</Label>
                <Input
                    onKeyDown={(e)=>{if(e.key === 'Enter') submit()}}
                    value={client.value?.name}
                    className="bg-primary-foregruond"
                    placeholder="Nome do cliente"
                    onChange={(e) => { client.value = {...client.value, name: e.target.value }}}
                />
            </section>
            
            {/* Endereço */}
            <section className="flex flex-col space-y-1.5">
                <Label>Endereço do cliente</Label>
                <AddressAutocomplete
                    value={client.value?.street_id}
                    setSelected={(value, payload)=>{
                        client.value = { ...client.value, street_id: value }
                        
                        console.log('>', typeof value, payload)
                        if(payload) {
                            client.value = { ...client.value, neighborhood_id: payload.neighborhood_id }
                        }
                    }}
                />
            </section>

            {typeof client.value?.street_id === 'object' && (
                <section className="flex flex-col space-y-1.5">
                    <Label>Bairro do cliente</Label>
                    <NeighborhoodAutocomplete
                        value={client.value?.neighborhood_id}
                        setSelected={(value, payload)=>{
                            console.log(payload);
                            
                            client.value = { ...client.value, neighborhood_id: value }
                        }}
                        selected_externally_key="neighborhood_name"
                    />
                </section>
            )}
{/* 
            {typeof client.value?.neighborhood_id === 'object' && (
                <section className="flex flex-col space-y-1.5">
                    <Label>Cidade</Label>
                    <CityAutocomplete
                        value={client.value?.city_id}
                        setSelected={(value)=>{
                            client.value = { ...client.value, city_id: value  }
                        }}
                        // selected_externally_key="city_name"
                    />
                </section>
            )} */}

            <section className="flex gap-2">
                <span className="w-full">
                    <Label>Quadra/Bloco</Label>
                    <Input
                    onKeyDown={(e)=>{if(e.key === 'Enter') submit()}}
                        value={client.value?.block}
                        className="bg-primary-foregruond"
                        placeholder="Quadra/Bloco"
                        onChange={(e) => { client.value = {...client.value, block: e.target.value }}}
                    />
                </span>
                <span className="w-full">
                    <Label>Número da residência</Label>
                    <Input
                    onKeyDown={(e)=>{if(e.key === 'Enter') submit()}}
                        value={client.value?.number}
                        className="bg-primary-foregruond"
                        placeholder="Número da residência"
                        onChange={(e) => { client.value = {...client.value, number: e.target.value }}}
                    />
                </span>
            </section>

            <section>
                <Label>Ponto de referência</Label>
                <Input
                    onKeyDown={(e)=>{if(e.key === 'Enter') submit()}}
                    value={client.value?.reference}
                    className="bg-primary-foregruond"
                    placeholder="Ponto de referência"
                    onChange={(e) => { client.value = {...client.value, reference: e.target.value }}}
                />
            </section>

            <section>
                <Label>CPF/CNPJ</Label>
                <Input
                    onKeyDown={(e)=>{if(e.key === 'Enter') submit()}}
                    value={client.value?.cpf_cnpj}
                    className="bg-primary-foregruond"
                    placeholder="CPF/CNPJ"
                    onChange={(e) => { client.value = {...client.value, cpf_cnpj: e.target.value }}}
                />
            </section>

            <section>
                <Label>Nome Fantasia</Label>
                <Input
                    onKeyDown={(e)=>{if(e.key === 'Enter') submit()}}
                    value={client.value?.fantasy_name}
                    className="bg-primary-foregruond"
                    placeholder="Nome Fantasia"
                    onChange={(e) => { client.value = {...client.value, fantasy_name: e.target.value }}}
                />
            </section>

            <section>
                <Label>Whatsapp</Label>
                <Input
                    onKeyDown={(e)=>{if(e.key === 'Enter') submit()}}
                    value={client.value?.whatsapp}
                    className="bg-primary-foregruond"
                    placeholder="Whatsapp"
                    onChange={(e) => { client.value = {...client.value, whatsapp: e.target.value }}}
                />
            </section>


            <section>
                <Label>Telefone</Label>
                <Input
                    onKeyDown={(e)=>{if(e.key === 'Enter') submit()}}
                    value={client.value?.phone}
                    className="bg-primary-foregruond"
                    placeholder="Telefone"
                    onChange={(e) => { client.value = {...client.value, phone: e.target.value }}}
                />
            </section>

            <div className="flex flex-row fllex-grow">
                <Button variant="outline" className="mt-2 w-full mr-1" onClick={()=>client.value=null}>
                    Fechar
                </Button>
                <Button className="mt-2 w-full" onClick={submit}>
                    {client.value?.id ? 'Modificar Cliente' : 'Criar Cliente'}
                </Button>
            </div>
        </span>
    )
}