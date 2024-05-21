import { Icons } from "../icons/icons";

export const NoResults = ({date="", onClick=()=>{}, showAddOrder=false, className="", noResultsText="Sem resultados."}) => 
    <div className={`text-center bg-gray-50 items-center h-full ${className}`}>
      <h3 className="text-sm font-medium text-gray-500 pt-20 text-center items-center"> 
        <span className="flex items-center flex-col">
          <Icons.EmptyFolder />
          <span className="flex"> 

          { noResultsText ? noResultsText : `Sem vendas no dia ${date.split('-').reverse().join('/')}`}
          </span>
        </span>
      </h3>
      {showAddOrder && 
        <>
        <p className="mt-1 text-sm text-gray-500">Adicione uma venda para aparecer aqui</p>
        <div className="mt-6">
          <button
            type="button"
            className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            onClick={onClick}
          >
            <Icons.AddIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            Adicionar venda
          </button>
        </div>
        </>
      }
    </div>
