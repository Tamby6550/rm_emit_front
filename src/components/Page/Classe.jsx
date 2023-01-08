import React, { useState, useEffect, useRef } from 'react'
import { DataTable } from 'primereact/datatable'
import { Button } from 'primereact/button'
import { Column } from 'primereact/column'
import { PrimeIcons } from 'primereact/api'
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import InsertionClasse from './Classe/InsertionClasse'
import ModificationClasse from './Classe/ModificationClasse'
import Recherche from './Classe/Recherche'
import axios from 'axios';
import { Toast } from 'primereact/toast';


export default function Classe(props) {

  //Chargement de données
  const [charge, setCharge] = useState(false);
  const [refreshData, setrefreshData] = useState(0);
  const [listClasse, setlistClasse] = useState([{ id_classe: '', libelle_classe: '', nbre_etud: '', anne_scolaire: '', id_parcours: '', nom_mention: '', abbrmention: '', nom_parcours: '', abbrparcours: '' }]);
  const [infoClasse, setinfoClasse] = useState({ libelle_classe: '', nbre_etud: '', anne_scolaire: '', id_parcours: '' });
  const onVideInfo = () => {
    setinfoClasse({ libelle_classe: '', nbre_etud: '', anne_scolaire: '', id_parcours: '' });
  }
  const [totalenrg, settotalenrg] = useState(null)

  /**Style css */
  const stylebtnRec = {
    fontSize: '1rem', padding: ' 0.8375rem 0.975rem', backgroundColor: '#a79d34', border: '1px solid #a79d34'
  };
  const stylebtnDetele = {
    fontSize: '1rem', padding: ' 0.8375rem 0.975rem', backgroundColor: 'rgb(195 46 46 / 85%)', border: '1px solid #d32f2fa1'
  };

  /**Style css */

  const toastTR = useRef(null);
  /*Notification Toast */
  const notificationAction = (etat, titre, message) => {
    toastTR.current.show({ severity: etat, summary: titre, detail: message, life: 10000 });
  }

  //Get List client
  const loadData = async () => {
    await axios.get(props.url + `getClasseMentionParcours`)
      .then(
        (result) => {
          onVideInfo();
          setrefreshData(0);
          setlistClasse(result.data);
          setCharge(false);
        }
      );
  }

  useEffect(() => {
    setCharge(true);
    // setlistClasse([{ stat: 'Chargement de données...' }])
    setTimeout(() => {
      loadData();
    }, 500)
  }, [refreshData]);

  const header = (
    <div className='flex flex-row justify-content-between align-items-center m-0 '>
      <div className='my-0 flex  py-2'>
        <InsertionClasse url={props.url} setrefreshData={setrefreshData} />
        <Recherche url={props.url} setrefreshData={setrefreshData} setlistClasse={setlistClasse} setinfoClasse={setinfoClasse} />
      </div>
      {infoClasse.libelle_classe != "" || infoClasse.id_parcours != "" ? <Button icon={PrimeIcons.REFRESH} className='p-buttom-sm p-1 p-button-warning ' tooltip='actualiser' tooltipOptions={{ position: 'top' }} onClick={() => setrefreshData(1)} />
        :
        <>
          <label >Liste des Classes dans l'EMIT </label>
          <label className='ml-5 mt-1 ' style={{visibility:'hidden'}} >sdfsdfsdfsdfsdf Liste des Classes d  </label>
        </>
      }
    </div>
  )

  const bodyBoutton = (data) => {
    return (
      <div className='flex flex-row  align-items-center m-0 '>
        {/* <div className='my-0  py-2'> */}
        <ModificationClasse data={data} url={props.url} setrefreshData={setrefreshData} nomMention={data.nom_mention + '(' + data.abbrmention + ')'} />
        <Button icon={PrimeIcons.TIMES} className='p-buttom-sm p-2 ' style={stylebtnDetele} tooltip='Supprimer' tooltipOptions={{ position: 'top' }}
          onClick={() => {
            const accept = () => {
              axios.delete(props.url + `supprimerClasse/${data.id_classe}`)
                .then(res => {
                  notificationAction(res.data.etat, res.data.status, res.data.message);
                  if (res.data.etat == 'info') {
                    setrefreshData(1)
                  }
                })
                .catch(err => {
                  console.log(err);
                  notificationAction('error', 'Suppression non reuissie !', 'Enregirement non supprimer !');
                })
            }
            const reject = () => {
              return null;
            }

            confirmDialog({
              message: 'Voulez vous supprimer la Classe : ' + data.libelle_classe,
              header: 'Suppression  ',
              icon: 'pi pi-exclamation-circle',
              acceptClassName: 'p-button-danger',
              acceptLabel: 'Ok',
              rejectLabel: 'Annuler',
              accept,
              reject
            });
          }} />
      </div>
    )
  }
  const bodyMention = (data) => {
    return (
      <div className='flex flex-row justify-content-between align-items-center m-0 '>
        <div className='my-0  py-2'>
          <label htmlFor="">{data.nom_mention + '(' + data.abbrmention + ')'}</label>
        </div>
      </div>
    )
  }
  const bodyParcours = (data) => {
    return (
      <div className='flex flex-row justify-content-between align-items-center m-0 '>
        <div className='my-0  py-2'>
          <label htmlFor="">{data.nom_parcours + '(' + data.abbrparcours + ')'}</label>
        </div>
      </div>
    )
  }

  return (
    <>
      <Toast ref={toastTR} position="top-right" />
      <ConfirmDialog />

      <div className="flex flex-column justify-content-center">
        <DataTable header={header} value={listClasse} autoLayout={true}  loading={charge} className='bg-white' emptyMessage={'Aucun resultat trouvé'}>
          <Column field='libelle_classe' header="Classe" ></Column>
          <Column field='nbre_etud' header="Nbre étud" ></Column>
          <Column body={bodyParcours} header="Parcours" ></Column>
          <Column body={bodyMention} header="Mention"  ></Column>
          <Column field='anne_scolaire' header="A. Scolaire"  ></Column>
          <Column header="action" body={bodyBoutton} align={'left'}></Column>
        </DataTable>
      </div>
    </>
  )
}
