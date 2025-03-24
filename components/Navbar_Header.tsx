'use client'
import React from "react";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarMenuToggle, NavbarMenu, NavbarMenuItem, Link, Button } from "@heroui/react";
import axios from "axios";


export default function Navbar_header(verification: any) {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const menuItems = [
    {name: 'Inicio', link:'/'},
    {name: 'Unidades', link:'/unidades'},
    {name: 'Fiscales', link:'/fiscales'},
    {name: 'Rutas', link:'/rutas'},
    {name: 'Horarios', link:'/horarios'}
  ];
  const loggedOut = () => {
    axios.get('/api/auth/logout')
    .then(response => {
      if(response.status == 200){
        location.reload();
      }
    })
  }
  console.log(verification)
  return (
    <Navbar onMenuOpenChange={setIsMenuOpen} className=" grid grid-cols-2 bg-blue-950 w-full">
      <NavbarContent>
        <NavbarBrand>
          
          <Link href="/" className="font-bold text-white">BusQRCode</Link>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-4" justify="start">

        {verification.verification == 5 ? (
            <>
          {menuItems.map((item, index) => (
            <NavbarItem key={index}>
            <Link className="text-slate-100" href={item.link}>
            <p className="hover:text-blue-400">
            {item.name}
            </p>
            </Link>
            </NavbarItem>
          ))}

          </>
        ):''}
        <NavbarItem>

        <Link
        href="/login"
        onClick={loggedOut}
        color={"foreground"
        }
        className="w-full text-slate-100"
        >
          Cerrar Sesión
        </Link>
          </NavbarItem>
      </NavbarContent>
      
      <NavbarMenu>
          <NavbarMenuItem >
        {menuItems.map((item, index) => (
            <Link
              key={`${item}-${index}`}
              color={ "foreground"
              }
              className="w-full"
              href={item.link}
              size="lg"
            >
              {item.name}
            </Link>
        ))}
          </NavbarMenuItem>
      </NavbarMenu>
    </Navbar>
  );
}
