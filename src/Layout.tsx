

interface Props { children: JSX.Element | JSX.Element[] }

export const LayoutPage = ({ children }: Props) => {
   // className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]"
    return (

        <div >
            {children}
        </div>
    )
}