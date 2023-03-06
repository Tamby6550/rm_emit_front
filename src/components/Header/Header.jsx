import React, { useState } from 'react'
import { Sidebar } from 'primereact/sidebar'
import { Card } from 'primereact/card'
import { PanelMenu } from 'primereact/panelmenu'
import { Button } from 'primereact/button';
import { PrimeIcons } from 'primereact/api'
import { Link, useLocation, useNavigate } from 'react-router-dom'


export default function Header() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const classactive = "menu-active"
  const [visibleLeft, setVisibleLeft] = useState(false);

  const items = [
    {
      label: 'Accueil',
      icon: PrimeIcons.HOME,
      className: pathname === "/acceuil" && classactive,
      command: () => {
        navigate("/acceuil");

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
      label: 'Enseignant',
      icon: PrimeIcons.USERS,
      className: pathname === "/proffesseur" && classactive,
      command: () => {
        navigate("/proffesseur");

      }
     }, 

    // {
    //   label: 'Classe',
    //   icon: PrimeIcons.USERS,
    //   className: pathname === "/classe" && classactive,
    //   command: () => {
    //     navigate("/classe");
    //   }
    // },
    {
      label: 'Tableau Affichage',
      icon: PrimeIcons.LIST,
      className: pathname === "/affichage_tableau" && classactive,
      command: () => {
        navigate("/affichage_tableau");
      }
    },
    {
      label: 'Paramètre',
      icon: PrimeIcons.SLACK,
      className: pathname === "/parametre" && classactive,
      command: () => {
        navigate("/parametre");
      }
    },

    // {
    //   label: 'Rapport',
    //   icon: PrimeIcons.BRIEFCASE,
    // },
    // {
    //   label: 'Utilisateur',
    //   icon: PrimeIcons.COG,
    // },//{
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
      <div className='humbergeur' >
        {/* <h1 className='text-center my-0 text-lg pt-2'>Menu</h1> */}
        <Button icon={PrimeIcons.BARS} tooltip={'Menu'} onClick={() => setVisibleLeft(true)} className="ml-3 mt-3 p-button-sm p-button-secondary" />
      </div>
      <div className="lg:col-2 md:col-2 sm:col-3 col-3 p-0 mobile-m" style={{ minHeight: '84vh' }} >
        <Card className='h-full p-0 card-custom'  >
        <h1 className='text-center my-0 text-lg pt-2'>Menu</h1>
          <PanelMenu model={items} className="bg-white w-full pt-2 tamby-menu" />
        </Card>
        <Sidebar visible={visibleLeft} onHide={() => setVisibleLeft(false)}>
          <h1 className='text-center my-0 text-lg pt-2'>Menu</h1>
          <Card className='h-full p-0 card-custom'  >
            <PanelMenu model={items} className="bg-white w-full pt-2 tamby-menu" />
          </Card>
        </Sidebar>
      </div>
      {/* <div className="container">
           <div style={{width: isOpen ? "200px" : "50px"}} className="sidebar">
               <div className="top_section">
                   <h1 style={{display: isOpen ? "block" : "none"}} className="logo">Logo</h1>
                   <div style={{marginLeft: isOpen ? "50px" : "0px"}} className="bars">
                       <PrimeIcons.BARS onClick={toggle}/>
                   </div>
               </div>
               {
                   menuItem.map((item, index)=>(
                       <NavLink to={item.path} key={index} className="link" activeclassName="active">
                           <div className="icon">{item.icon}</div>
                           <div style={{display: isOpen ? "block" : "none"}} className="link_text">{item.name}</div>
                       </NavLink>
                   ))
               }
           </div>
           <main>{children}</main>
        </div> */}
    </>
  )
}
