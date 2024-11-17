import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
const DynamicBreadcrumb = () => {
    const location = useLocation(); // Obtiene la ubicación actual
    const pathnames = location.pathname.split('/').filter((x) => x); // Divide la ruta en segmentos

    return (
        <Breadcrumb>
            <BreadcrumbList>
                {pathnames.map((pathname, index) => {
                    const to = `/${pathnames.slice(0, index + 1).join('/')}`; // Construye la ruta

                    return (
                        <React.Fragment key={to}>
                            <BreadcrumbItem className={index === 0 ? "hidden md:block" : ""}>
                                <BreadcrumbLink asChild>

                                    <Link to={to}>
                                        <BreadcrumbPage>{pathname.charAt(0).toUpperCase() + pathname.slice(1)}</BreadcrumbPage>
                                    </Link>
                                   
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            {index < pathnames.length - 1 && <BreadcrumbSeparator className="hidden md:block" />} {/* Separador */}
                        </React.Fragment>
                    );
                })}
            </BreadcrumbList>
        </Breadcrumb>
    );
};

export default DynamicBreadcrumb;
