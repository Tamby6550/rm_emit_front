import React from 'react'
import { Sidebar } from 'primereact/sidebar'
import { Card } from 'primereact/card'
import { PanelMenu } from 'primereact/panelmenu'
import { Menubar } from 'primereact/menubar'
import logo from '../../images/crdt.jpg'
import header_brand from '../../images/header.jpg'
import { PrimeIcons } from 'primereact/api'
import { Link, useLocation, useNavigate } from 'react-router-dom'


export default function Header() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const classactive = "menu-active"

  const items = [
    {
      label: 'Accueil',
      icon: PrimeIcons.HOME,
      className: pathname === "/" && classactive,
      command: () => {
        navigate("/");
      
      }
    },
    {
      label: 'Element Constitutifs',
      icon: PrimeIcons.BOOK,
      className: pathname === "/element_constitutifs" && classactive,
      command: () => {
        navigate("/element_constitutifs");
      }
    },
    
    {
      label: 'Proffesseur',
      icon: PrimeIcons.USERS,
      className: pathname === "/proffesseur" && classactive,
      command: () => {
        navigate("/proffesseur");
      
      }
    },
    
    {
      label: 'Classe',
      icon: PrimeIcons.USERS,
      className: pathname === "/classe" && classactive,
      command: () => {
        navigate("/classe");
      }
    },
    {
      label: 'Mention',
      icon: PrimeIcons.USERS,
      className: pathname === "/mention" && classactive,
      command: () => {
        navigate("/mention");
      }
    },
    
    {
      label: 'Rapport',
      icon: PrimeIcons.BRIEFCASE,
    },
    {
      label: 'Utilisateur',
      icon: PrimeIcons.COG,
    },//{
    //   label: 'Element Constitutifs',
    //   icon: PrimeIcons.BOOKMARK,
    //   expanded:pathname === "/client" || pathname === "/patient" || pathname === "/prescripteur" || pathname === "/examen" ? true : false ,
    //   items: [
    //     {
    //       label: 'Patient',
    //       icon: PrimeIcons.FILE,
    //       className: pathname === "/patient" && classactive,
    //       command: () => {
    //         navigate("/patient");
          
    //       }
    //     },
    //     {
    //       label: 'Client',
    //       icon: PrimeIcons.CREDIT_CARD,
    //       className: pathname === "/client" && classactive,
    //       command: () => {
    //         navigate("/client");
          
    //       }
    //     },
    //     {
    //       label: 'Prescripteur',
    //       icon: PrimeIcons.FILE,
    //       className: pathname === "/prescripteur" && classactive,
    //       command: () => {
    //         navigate("/prescripteur");
          
    //       }
    //     },
    //     {
    //       label: 'Examen',
    //       icon: PrimeIcons.FILE,
    //       className: pathname === "/examen" && classactive,
    //       command: () => {
    //         navigate("/examen");
    //       }
    //     }
    //   ]
    // },
  ];


  return (
    <>
      <div className="lg:col-2 md:col-2 sm:col-3 col-3 p-0 " style={{ minHeight: '88vh',backgroundColor:'green' }} >

        <Card className='h-full p-0 card-custom' >
          <h1 className='text-center my-0 text-lg pt-2'>Menu</h1>
          <PanelMenu model={items} className="bg-white w-full pt-2 tamby-menu" />
        </Card>
      </div>
    </>
  )
}
