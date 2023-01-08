import logo from './images/emit.png';
import './App.css';
import './tamby.css'
import Header from './components/Header/Header';
import { Button } from 'primereact/button'
import { Card } from 'primereact/card';
import { Route, Routes, useLocation } from 'react-router-dom';
import { BreadCrumb } from 'primereact/breadcrumb'
import Accueil from './components/Page/Accueil';
import Proffesseur from './components/Page/Proffesseur';
import ElementConst from './components/Page/ElementConst';
import Classe from './components/Page/Classe';
import Mention from './components/Page/Mention';
function App() {
  const url = "http://localhost:2000/api/";
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
  return (
    <div className="App p-0" >
      <div className='grid p-0 mb-3' style={{ minWidth: "500px" }}>
        <div className='col-12 tete-logo flex justify-content-between h-1em'  >
          <img src={logo} className=" max-h-4rem flex" />
         <h1 className='m-1 p-1'>Application de suivie de ...</h1>
         <h1 style={{visibility:'hidden'}}>Ap</h1>
          {/* <div className='grid p-0'>
            <div className="lg:col-2 md:col-2 sm:col-3 col-3 p-0">
              <Card className=' custom-card-haut p-0 flex align-items-center justify-content-center'>
                <div className='flex justify-content-center pb-2'>
                </div>
              </Card>
        
            </div>
            <div className='lg:col-10 md:col-10 sm:col-9 col-9 pl-2 p-0'>
              <Card className='h-full custom-card-haut p-0 flex align-items-center justify-content-center'  >
                <div className='flex justify-content-center h-full w-full' >

                </div>
              </Card>
            </div>
          </div> */}
        </div>
        <div className='col-12'>
          <div className='grid p-0'>
         
              <Header />
          
            <div className='lg:col-10 md:col-10 sm:col-9 col-9 pl-2 p-0' style={{color:'#0B0C28'}}>
              <div className=''>
                <div className='col-12'>
                  <div className='grid'>
                    <div className='lg:col-9 sm:col-12 col-12'>

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
                    <div className='lg:col-3 sm:col-12 col-12 pt-0 flex justify-content-end'>
                      <Button label='Se deconnecter' icon='pi pi-power-off' className='p-button-primary p-button-text mt-2'></Button>
                    </div>
                  </div>
                </div>
                <div className='col-12'>
                  <Routes>
                    <Route path='/proffesseur' element={<Proffesseur url={url} />} />
                    <Route path='/element_constitutifs' element={<ElementConst url={url} />} />
                    <Route path='/classe' element={<Classe url={url} />} />
                    <Route path='/mention' element={<Mention url={url} />} />
                    <Route path='/' element={<Accueil url={url} />} />
                  </Routes>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

export default App;
