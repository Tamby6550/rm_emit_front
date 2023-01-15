import logo from './images/emit.png';
import './App.css';
import './tamby.css'
import Header from './components/Header/Header';
import { Button } from 'primereact/button'
import { Card } from 'primereact/card';
import { Outlet, Route, Routes, useLocation } from 'react-router-dom';
import { BreadCrumb } from 'primereact/breadcrumb'
import Accueil from './components/Page/Accueil';
import Proffesseur from './components/Page/Proffesseur';
import ElementConst from './components/Page/ElementConst';
import Classe from './components/Page/Classe';
import Mention from './components/Page/Mention';
import Signin from './components/Login/Signin';
import useAuth from './components/Login/useAuth';
import { useNavigate } from 'react-router-dom'
import React,{useEffect,useState} from 'react';
import CryptoJS from 'crypto-js';

function App() {
    const { logout, isAuthenticated, secret } = useAuth();
    const [infoUti, setinfoUti] = useState({nom:'',mention:''})
    const decrypt = () => {
        const virus = localStorage.getItem("virus");
        const token = localStorage.getItem("token");
        const decryptedData = CryptoJS.AES.decrypt(virus, secret);
        const dataString = decryptedData.toString(CryptoJS.enc.Utf8);
        const data = JSON.parse(dataString);
        setinfoUti({nom:data.nom,mention:data.grad_nom+' '+data.mention})
    }
  const navigate = useNavigate()
  const url = "http://192.168.42.48:2000/api/";
  const { pathname } = useLocation();
  const bred = pathname.slice(1);
  const items = [
    { label: bred }
  ]
  const reglement = [
    { label: "Reglement" },
    { label: bred }
  ]
  const referentielss = [
    { label: "Référentiels" },
    { label: bred }
  ]
  const factures = [
    { label: "Facture" },
    { label: bred }
  ]

  const Home = { icon: 'pi pi-home' }
  useEffect(() => {
    setTimeout(() => {
        decrypt();
    }, 500)
}, [navigate])
  return (
    <div className="App p-0" >
    <Routes>
        <Route element={<div className='grid p-0 mb-3' style={{ minWidth: "500px" }}>
            <div className='col-12 tete-logo flex justify-content-between h-1em'  style={{alignItems:'center'}} >
                <img src={logo} className=" max-h-4rem flex" />
                <h1 className='m-1 p-1 mobile-non-titre'>Application pour les Responsables des Mentions</h1>
                <div className='mr-2'>
                    <h4> <u>Nom utilisateur :</u>  {infoUti.nom} </h4>
                    <h4> <u>RM  de :</u>  {infoUti.mention} </h4>
                </div>
            </div>
            <div className='col-12 container-tamby'>
            <div className='grid p-0'>
                        <Header />
                    <div className='lg:col-10 md:col-10 sm:col-12 col-12 pl-2 p-0' style={{ color: '#0B0C28'}}>
                        <div className=''>
                            <div className='col-12'>
                                <div className='grid'>
                                    <div className='lg:col-9 sm:col-8 col-8'>

                                        {bred === "mode_paiement" || bred === "saisie_reglement" ?
                                            <BreadCrumb model={reglement} home={Home} className=" w-full" />
                                            :
                                            bred === "client" || bred === "examen" || bred === "patient" || bred === "prescripteur" ?
                                                <BreadCrumb model={referentielss} home={Home} className=" w-full" />
                                                :
                                                bred === "ajout" || bred === "details" || bred === "impression" || bred === "annulation" ?
                                                    <BreadCrumb model={factures} home={Home} className=" w-full" />
                                                    :
                                                    <BreadCrumb model={items} home={Home} className=" w-full" />
                                        }
                                    </div>
                                    <div className='lg:col-3 sm:col-4 col-4 pt-0 flex justify-content-end '  >
                                        <Button  tooltip='Déconnecter' label='Déconnecter' tooltipOptions={{position:'top'}} style={{fontWeight:'600',fontSize:'1.1em'}} icon='pi pi-power-off' className='p-button-primary p-button-text mt-2 ' onClick={logout} >
                                           
                                        </Button>
                                    </div>
                                </div>
                            </div>
                            <div className='col-12'> 
                            <Outlet />
                            </div>
                        </div>
                    </div>
                </div>
                <footer className='col-12 tete-logo flex justify-content-center h-2em'>
                    <small>Copyright Tamby Arimisa (EMIT-ITDC Mada)</small>
                </footer>
            </div>
        </div>
        }>
            <Route path='/proffesseur' element={<Proffesseur url={url} />} />
            <Route path='/element_constitutifs' element={<ElementConst url={url} />} />
            <Route path='/classe' element={<Classe url={url} />} />
            <Route path='/mention' element={<Mention url={url} />} />
            <Route path='/' element={<Accueil url={url} />} />
        </Route>

        <Route path='/login' element={<Signin url={url} />} />
    </Routes>
</div>

  );
}

export default App;
