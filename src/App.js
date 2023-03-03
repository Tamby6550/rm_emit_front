import logo from './images/emit.png';
import './App.css';
import './tamby.css';
import './tableau.css';
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
import React,{useEffect,useState,useRef} from 'react';
import CryptoJS from 'crypto-js';
import axios from 'axios';
import { Dialog } from 'primereact/dialog';
import * as Components from './components/Login/Components'
import { PrimeIcons } from 'primereact/api';
import { Toast } from 'primereact/toast'; 
import MenuAffichage from './components/Page/Tableau/MenuAffichage';
import Parametre from './components/Page/Parametre/Parametre';
function App() {
    const { logout, isAuthenticated, secret } = useAuth();
    const [infoUti, setinfoUti] = useState({nom:'',mention:''});
    const [chmdp, setchmdp] = useState({an_mdp:'',rm_id:'',nv_mdp:''});
    const [verfConfirm, setverfConfirm] = useState(false)
    const [voirmdp, setvoirmdp] = useState(false);
    const [chargementCH, setchargementCH] = useState(false)

    const decrypt = () => {
        const virus = localStorage.getItem("virus");
        const token = localStorage.getItem("token");
        const decryptedData = CryptoJS.AES.decrypt(virus, secret);
        const dataString = decryptedData.toString(CryptoJS.enc.Utf8);
        const data = JSON.parse(dataString);
        console.log(data)
        setinfoUti({nom:data.nom,mention:data.grad_nom+' '+data.mention});
        setchmdp({...chmdp,rm_id:data.rm_id});
    }


    const onChargeDonneChMdp = (e) => {
        setchmdp({ ...chmdp, [e.target.name]: e.target.value })
    }


    const [url, seturl] = useState('http://192.168.88.2/backRM/api/')
    const navigate = useNavigate()
    //   const url = "http://127.0.01:2000/api/";
    //   const url = "http://192.168.42.48:2000/api/";
    //   const url = "http://192.168.88.2/backRM/api/";
    //   const url = "http://41.188.47.76/backRM/api/";

    //Chagment adresse ip
    const urlip=()=>{
            let ip = window.location.hostname;
            //Serveur emit
            // let urls ='http://'+ip+'/backRM/api/'

            // //local
            let urls ='http://'+ip+':2000/api/'
            seturl(urls);
            console.log(urls)
    }

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
    urlip()
}, [navigate])




    /* Modal */
    const [displayBasic2, setDisplayBasic2] = useState(false);
    const [position, setPosition] = useState('center');
    const dialogFuncMap = {
        'displayBasic2': setDisplayBasic2,
    }
    const onClick = (name, position) => {
        dialogFuncMap[`${name}`](true);

        if (position) {
            setPosition(position);
        }
    }
    const onHide = (name) => {
        dialogFuncMap[`${name}`](false);
    }

    const renderFooter = (name) => {
        return (
            <div>
                <Button label="Fermer" icon="pi pi-times" onClick={() => onHide(name)} className="p-button-text" />
            </div>
        );
    }
    const renderHeader = (name) => {
        return (
            <div>
                <h4 className='mb-1'>Modification mot de passe</h4>
                <hr />
            </div>
        );
    }
    /** Fin modal */


    const toastTR = useRef(null);
    /*Notification Toast */
    const notificationAction = (etat, titre, message) => {
      toastTR.current.show({ severity: etat, summary: titre, detail: message, life: 3000 });
    }


    const changeMdp = async () => {
        setchargementCH(true)
        try {
            await axios.post(url + 'changeMdp', chmdp,
                {
                    headers: {
                        "Content-Type": "application/json; charset=utf-8",
                        "X-API-KEY": "tamby"
                    },
                }
            ).then(res => {
                notificationAction(res.data.etat, res.data.situation, res.data.message);      
                setchargementCH(false);
                if (res.data.etat=='success') {
                    onHide('displayBasic2');
                    let i=0;
                    setTimeout(() => {
                       alert('Vous allez rediriger vers la page login pour la modification de mot de passe')
                        logout();
                    }, 1000);
                }
            })
            .catch(err => {
                    setchargementCH(false)
                    console.log(err);
                });
        } catch (err) {
            console.error(err);
        }
    };

  return (
    <div className="App p-0" >
                <Toast ref={toastTR} position="top-center" />

         <Dialog header={renderHeader('displayBasic2')} visible={displayBasic2} className="lg:col-3 md:col-5 col-8 p-0" footer={renderFooter('displayBasic2')} onHide={() => onHide('displayBasic2')}  >
                <div className="p-1  style-modal-tamby">
                    <div className="col-12 field my-1 flex flex-column">
                        <Components.Label >Ancien mot de passe </Components.Label>
                        <Components.Input type='password' placeholder='Ancien mot de passe'  name='an_mdp' onChange={onChargeDonneChMdp} />
                        <div className='mt-2'>
                            <Components.Label >Nouveau mot de passe </Components.Label>
                            <Components.Input type='password' placeholder='Nouveau mot de passe'  name='nv_mdp' onChange={onChargeDonneChMdp} />
                            <div className='m-0 p-0 flex ' style={{alignItems:'center'}} >
                            <Components.Input type={voirmdp? 'text' :'password'}  placeholder='Confirmer le mot de passe'  name='cof_mdp' onChange={onChargeDonneChMdp}  />
                            <Button icon={!voirmdp? PrimeIcons.EYE:PrimeIcons.EYE_SLASH} style={{height:'100%'}} onClick={()=>{setvoirmdp(!voirmdp)}} ></Button>
                            </div>
                          <center>
                             {verfConfirm ? <small id="username2-help" className="p-error block">Votre mot de passe n'est pas identique !</small> : null}
                            </center> 

                        </div>
                    </div>
                    <center>
                    <Button   label={chargementCH? '...' :'Sauvegarder la modification'} tooltipOptions={{position:'top'}} style={{fontWeight:'600',fontSize:'1em'}}  className=' p-button-secondary ' 
                        onClick={() => {
                            if (chmdp.an_mdp=='' || chmdp.nv_mdp==''|| chmdp.cof_mdp=='') {
                                alert('Verifer votre champ !')
                            }else{
                                if (chmdp.nv_mdp!=chmdp.cof_mdp) {
                                    setverfConfirm(true)
                                }else{
                                    setverfConfirm(false);
                                    changeMdp();
                                }
                            }
                        }}  
                    /> 
                    </center>
                </div>
            </Dialog>


    <Routes>
        <Route element={<div className='grid p-0 mb-3' style={{ minWidth: "500px" }}>
            <div className='col-12 tete-logo flex justify-content-between h-1em'  style={{alignItems:'center'}} >
                <img src={logo} className=" max-h-4rem flex" />
                <h1 className='m-1 p-1 mobile-non-titre'>Suivi Pédagogique</h1>
                <div className='mr-2'>
                    <h4 className='m-1'> <u>Nom utilisateur :</u>  {infoUti.nom} </h4>
                    <h4 className='m-1'> <u>RM  de :</u>  {infoUti.mention} </h4>
                    <Button   label='Changer le mot de passe' tooltipOptions={{position:'top'}} style={{fontWeight:'600',fontSize:'1em'}}  className=' p-button-text ' onClick={() => { onClick('displayBasic2');  }}  >
                                           
                    </Button>
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
            <Route path='/proffesseur' element={<Proffesseur url={url} urlip={urlip}  />} />
            <Route path='/element_constitutifs' element={<ElementConst url={url}  urlip={urlip} />} />
            <Route path='/classe' element={<Classe url={url}  urlip={urlip} />} />
            <Route path='/mention' element={<Mention url={url}  urlip={urlip} />} />
            <Route path='/acceuil' element={<Accueil url={url} urlip={urlip}  />} />
            <Route path='/affichage_tableau' element={<MenuAffichage url={url} urlip={urlip}  />} />
            <Route path='/parametre' element={<Parametre url={url} urlip={urlip}  />} />
        </Route>

        <Route path='/' element={<Signin url={url} />} />
    </Routes>
</div>

  );
}

export default App;
