import { Fragment, useContext } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import context from './context';
const searches = [
    { name: 'A* Search' },
    { name: 'Greedy Search' },
    { name: 'Uniform Search' },
]

export default function DropDown() {

    const {selected, setSelected} = useContext(context)
    return (
        <div className="z-50 w-[150px] ">
            <Listbox value={selected} onChange={setSelected}>
                <div className="relative mt-1">
                    <Listbox.Button 
                    className="relative w-full flex justify-center cursor-default rounded-lg bg-opacity-0 active:bg-opacity-95 bg-blue-900 py-2 pl-3 text-white pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                       { <span className="block truncate">{`${selected.name || "A * Search"}`}</span>}
                        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                            <ChevronUpDownIcon
                                className="h-5 w-5 text-white"
                                aria-hidden="true"
                            />
                        </span>
                    </Listbox.Button>
                    <Transition
                        as={Fragment}
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <Listbox.Options className="absolute mt-1 z-50  max-h-60 w-full overflow-auto rounded-md bg-blue-900  py-1 text-base shadow-lg ring-1  ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                            {searches.map((searchAlgo, index) => (
                                <Listbox.Option
                                    key={index}
                                    className={({ active }) =>
                                        `relative cursor-default select-none  py-2 pl-10 pr-4 ${active ? 'bg-blue-800 text-white' : ' text-white '
                                        }`
                                    }
                                    value={searchAlgo}
                                >
                                    {({ selected }) => (
                                        <>
                                            <span
                                                className={`block truncate ${selected ? 'font-medium' : 'font-normal'
                                                    }`}
                                            >
                                                {searchAlgo.name}
                                            </span>
                                            {selected ? (
                                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                                                    <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                                </span>
                                            ) : null}
                                        </>
                                    )}
                                </Listbox.Option>
                            ))}
                        </Listbox.Options>
                    </Transition>
                </div>
            </Listbox>
        </div>
    )
}
