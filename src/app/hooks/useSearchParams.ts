import { useQueryStates, parseAsFloat, parseAsString } from 'nuqs'



export const useCustomQueryStates = () => {

    const [{ filter, year, mes, periodo  }, setCoordinates ] = useQueryStates(
        {
            // Use variable names that make sense in your codebase
            filter: parseAsString.withDefault(''),
            //mes: parseAsString.withDefault(new Date().getMonth().toString()),
            //year: parseAsString.withDefault(new Date().getFullYear().toString()), 
            mes: parseAsString.withDefault(''),
            year: parseAsString.withDefault(''),
            periodo: parseAsString.withDefault(''),
        },
        {
            history: 'push',
        }
    )

    return {
        filter,
        year, mes ,periodo,
        setCoordinates
    }

}

