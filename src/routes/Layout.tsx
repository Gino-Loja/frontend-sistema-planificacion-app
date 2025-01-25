import * as React from "react"
import { Link, useLocation } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"
import { Role } from "@/types/auth.types"
import {
    AudioWaveform,
    BadgeCheck,
    Bell,
    BookOpen,
    Bot,
    CheckCircle,
    ChevronRight,
    ChevronsUpDown,
    CircleUser,
    Command,
    CreditCard,
    Folder,
    Forward,
    Frame,
    GalleryVerticalEnd,
    LogOut,
    Map,
    MoreHorizontal,
    PieChart,
    Settings2,
    Sparkles,
    SquareTerminal,
    Trash2,
    XCircle,
} from "lucide-react"

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"

import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarInset,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    SidebarProvider,
    SidebarRail,
    SidebarTrigger,
} from "@/components/ui/sidebar"

import HoverCardBanner from "@/components/banners/HoverCard"
import { isRouteAuthorized } from "@/config/routes.config"
import DynamicBreadcrumb from "@/app/pages/DynamicBreadcrumb"
import { Toaster } from "react-hot-toast"
import { useDataStore } from "@/store"



const data = {
    user: {
        name: "shadcn",
        email: "m@example.com22",
        avatar: "/avatars/shadcn.jpg",
    },
    teams: [
        {
            name: "Acme Inc",
            logo: '/remove-fondo-uefo.png',
            plan: "Enterprise",
        }
    ],
    navMain: [
        {
            title: "Administracion",
            url: "#",
            icon: '/administrador.svg',
            isActive: true,
            items: [
                {
                    title: "Profesores",
                    url: "/dashboard-admin/profesores",
                },
                {
                    title: "Asignaturas",
                    url: "/dashboard-admin/asignaturas",
                },
                {
                    title: "Año lectivo",
                    url: "/dashboard-admin/periodo-lectivo",
                },
                {
                    title: "Areas",
                    url: "/dashboard-admin/areas",
                },
            ],
        },
        {
            title: "Planificación",
            url: "#",
            icon: '/planificacion.svg',
            items: [
                {
                    title: "Asignar",
                    url: "/dashboard-admin/asignar-planificacion",
                },
                {
                    title: "Planificaciones",
                    url: "/dashboard-admin/planificaciones-profesores",
                },

                // {
                //     title: "Planificaciones Profesor",
                //     url: "/planificaciones-profesores/profesor",
                // },

                {
                    title: "Mis Planificaciones",
                    url: "/dashboard/mis-planificaciones",
                },

            ],
        },
        


    ],
    projects: [
        {
            name: "Design Engineering",
            url: "#",
            icon: Frame,
        },
        {
            name: "Sales & Marketing",
            url: "#",
            icon: PieChart,
        },
        {
            name: "Travel",
            url: "#",
            icon: Map,
        },
    ],
}

const filterMenuItemsByRole = (items: typeof data.navMain, userRole: Role) => {
    return items.map(item => ({
        ...item,
        items: item.items?.filter(subItem =>
            isRouteAuthorized(subItem.url, userRole)
        )
    })).filter(item => item.items && item.items.length > 0)
}

interface LayoutProps {
    children: React.ReactNode;
}


export const LayoutPageRouter = ({ children }: LayoutProps) => {
    const [activeTeam, setActiveTeam] = React.useState(data.teams[0])
    const location = useLocation()
    const { user, logout } = useAuth()
    const { setData, setType } = useDataStore();


    const userRole = user?.role
    if (!userRole) {
        console.error("Lamentablemente no tienes permisos para acceder a esta página");
        return null; // O maneja la ausencia del rol de otra forma
    }

    const filteredNavMain = filterMenuItemsByRole(data.navMain, userRole)

    const getInitials = (name: string) => {
        const names = name.split(' ')
        if (names.length === 1) return names[0].charAt(0).toUpperCase()
        return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase()
    }

    return (
        <SidebarProvider>
            <Sidebar collapsible="icon">
                <SidebarHeader>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <SidebarMenuButton
                                        size="lg"
                                        className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                                    >
                                        <div className="flex aspect-square size-12 items-center justify-center rounded-lg  text-sidebar-primary-foreground">
                                            <img src={activeTeam.logo} alt="logo" className="size-12" />
                                        </div>
                                        <div className="grid flex-1 text-left text-sm leading-tight">
                                            <HoverCardBanner />
                                        </div>
                                        <ChevronsUpDown className="ml-auto" />
                                    </SidebarMenuButton>
                                </DropdownMenuTrigger>
                            </DropdownMenu>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarHeader>
                <SidebarContent>
                    <SidebarGroup>
                        <SidebarGroupLabel>Plataforma</SidebarGroupLabel>
                        <SidebarMenu>
                            {filteredNavMain.map((item) => (
                                <Collapsible
                                    key={item.title}
                                    asChild
                                    defaultOpen={item.isActive}
                                    className="group/collapsible"
                                >
                                    <SidebarMenuItem>
                                        <CollapsibleTrigger asChild>
                                            <SidebarMenuButton tooltip={item.title}>
                                                <img src={item.icon} alt={item.title} className="w-6 h-6" />
                                                <span>{item.title}</span>
                                                <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                            </SidebarMenuButton>
                                        </CollapsibleTrigger>
                                        <CollapsibleContent>
                                            <SidebarMenuSub>
                                                {item.items?.map((subItem) => (
                                                    <SidebarMenuSubItem key={subItem.title}>
                                                        <SidebarMenuSubButton
                                                            onClick={() => {
                                                                if (subItem.url === '/dashboard-admin/asignar-planificacion') {
                                                                    setType("create")
                                                                    setData(null)

                                                                }
                                                            }}
                                                            className={`${subItem.url === location.pathname ? 'text-primary bg-green-100' : ''}`}
                                                            asChild
                                                        >
                                                            <Link to={subItem.url}>
                                                                <span>{subItem.title}</span>
                                                            </Link>
                                                        </SidebarMenuSubButton>
                                                    </SidebarMenuSubItem>
                                                ))}
                                            </SidebarMenuSub>
                                        </CollapsibleContent>
                                    </SidebarMenuItem>
                                </Collapsible>
                            ))}
                        </SidebarMenu>
                    </SidebarGroup>
                    {/* <SidebarGroup className="group-data-[collapsible=icon]:hidden">
                        <SidebarGroupLabel>Projects</SidebarGroupLabel>
                        <SidebarMenu>
                            {data.projects.map((item) => (
                                <SidebarMenuItem key={item.name}>
                                    <SidebarMenuButton asChild>
                                        <Link to={item.url}>
                                            <item.icon />
                                            <span>{item.name}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <SidebarMenuAction showOnHover>
                                                <MoreHorizontal />
                                                <span className="sr-only">More</span>
                                            </SidebarMenuAction>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent
                                            className="w-48 rounded-lg"
                                            side="bottom"
                                            align="end"
                                        >
                                            <DropdownMenuItem>
                                                <Folder className="text-muted-foreground" />
                                                <span>View Project</span>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem>
                                                <Forward className="text-muted-foreground" />
                                                <span>Share Project</span>
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem>
                                                <Trash2 className="text-muted-foreground" />
                                                <span>Delete Project</span>
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </SidebarMenuItem>
                            ))}
                            <SidebarMenuItem>
                                <SidebarMenuButton className="text-sidebar-foreground/70">
                                    <MoreHorizontal className="text-sidebar-foreground/70" />
                                    <span>More</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroup> */}
                </SidebarContent>
                <SidebarFooter>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <SidebarMenuButton
                                        size="lg"
                                        className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                                    >
                                        <Avatar className="h-8 w-8 rounded-lg">

                                            <AvatarFallback className="rounded-lg">{getInitials(user.name)}</AvatarFallback>
                                        </Avatar>
                                        <div className="grid flex-1 text-left text-sm leading-tight">
                                            <span className="truncate font-semibold">
                                                {user.name}
                                            </span>
                                            <span className="truncate text-xs">
                                                {user.email}
                                            </span>
                                        </div>
                                        <ChevronsUpDown className="ml-auto size-4" />
                                    </SidebarMenuButton>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                                    side="bottom"
                                    align="end"
                                    sideOffset={4}
                                >
                                    <DropdownMenuLabel className="p-0 font-normal">
                                        <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                            <Avatar className="h-8 w-8 rounded-lg">
                                                <AvatarFallback className="rounded-lg">
                                                    {getInitials(user.name)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="grid flex-1 text-left text-sm leading-tight">
                                                <span className="truncate font-semibold">
                                                    {user.name}
                                                </span>
                                                <span className="truncate text-xs">
                                                    {user.email}
                                                </span>
                                            </div>
                                        </div>
                                    </DropdownMenuLabel>

                                    <DropdownMenuSeparator />
                                    <DropdownMenuGroup>
                                        <DropdownMenuItem>
                                            <BadgeCheck />
                                            {user.role}
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                            <CircleUser />
                                            {user.name}
                                        </DropdownMenuItem>
                                    </DropdownMenuGroup>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onSelect={logout}>
                                        <LogOut />
                                        Salir
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarFooter>
                <SidebarRail />
            </Sidebar>
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
                    <div className="flex items-center gap-2 px-4">
                        <SidebarTrigger className="-ml-1" />
                        <Separator orientation="vertical" className="mr-2 h-4" />
                        {/* <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem className="hidden md:block">
                                    <BreadcrumbLink href="#">
                                        Building Your Application
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator className="hidden md:block" />
                                <BreadcrumbItem>
                                    <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb> */}

                        <DynamicBreadcrumb />
                    </div>
                </header>
                <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                    <Toaster
                        toastOptions={{
                            success: {
                                className: "!bg-green-500 !text-white !border-green-600",
                                iconTheme: {
                                    primary: 'white',
                                    secondary: 'green',
                                },
                                icon: <CheckCircle className="h-5 w-5" />,
                            },
                            error: {
                                className: "!bg-red-500 !text-white !border-red-600",
                                iconTheme: {
                                    primary: 'white',
                                    secondary: 'red',
                                },
                                icon: <XCircle className="h-5 w-5" />,
                            },
                        }}
                    />
                    {children}
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}