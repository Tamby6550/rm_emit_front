import React, { useState, useEffect, useRef } from 'react'
import { Button } from 'primereact/button'
import { PrimeIcons } from 'primereact/api';
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import { Tag } from 'primereact/tag';
/*Importer modal */
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { InputNumber } from 'primereact/inputnumber';
import axios from 'axios'
import useAuth from '../../Login/useAuth';
import CryptoJS from 'crypto-js';
import { Dropdown } from 'primereact/dropdown';
import moment from 'moment/moment';
import { Dialog } from 'primereact/dialog';

export default function Parametre(props) {

    const { logout, isAuthenticated, secret } = useAuth();

    const decrypt = () => {
        const virus = localStorage.getItem("virus");
        const token = localStorage.getItem("token");
        const decryptedData = CryptoJS.AES.decrypt(virus, secret);
        const dataString = decryptedData.toString(CryptoJS.enc.Utf8);
        const data = JSON.parse(dataString);
        return { data, token };
    }

    const [infoGroup, setinfoGroup] = useState({ td: 0, tp: 0, anne_univ: '', niveau: '', mention: '', nombre: '0' })

    const [list, setlist] = useState([]);
    const [refreshData, setrefreshData] = useState(0);
    const [charge, setCharge] = useState(false);
    const [niveau, setniveau] = useState('0');
    const [selectniveau, setselectniveau] = useState(null);
    const [anne_univ, setanne_univ] = useState('0000-0000');
    const [selectanne, setselectanne] = useState(null);
    const onTypesChange = (e) => {
        setanne_univ(e.value);
    }
    const anne_univDt = async () => {
        await axios.get(props.url + `getAnneUniv`, {
            headers: {
                'Content-Type': 'text/html',
                'X-API-KEY': 'tamby',
                'Authorization': decrypt().token
            }
        })
            .then(
                (result) => {
                    if (result.data.message == 'Token Time Expire.') {
                        notificationAction('warn', 'Votre token est expiré !', 'Délais de token 4 heures !')
                        setTimeout(() => {
                            logout();
                        }, 3000)
                    }
                    setselectanne(result.data)

                }
            ).catch((e) => {
                // console.log(e.message)
                if (e.message == "Network Error") {
                    props.urlip()
                }
            })
    }

    const loadData = async (token, rm_id, mention_nom, grad_id, anne_univ) => {
        await axios.get(props.url + `getNombreClasse/${rm_id}/${mention_nom}/${grad_id}/${anne_univ}`, {
            headers: {
                'Content-Type': 'text/html',
                'X-API-KEY': 'tamby',
                'Authorization': token
            }
        })
            .then(
                (result) => {
                    if (result.data.message == 'Token Time Expire.') {
                        notificationAction('warn', 'Votre token est expiré !', 'Délais de token 4 heures !')
                        setTimeout(() => {
                            logout();
                        }, 3000)
                    }
                    setlist(result.data);
                    setselectniveau(result.data.niveau);

                    setCharge(false);
                    setrefreshData(0);
                    initFilters1();
                }
            ).catch((e) => {
                // console.log(e.message)
                if (e.message == "Network Error") {
                    props.urlip()
                }
            })
    }

    const chargementData = () => {
        const virus = localStorage.getItem('virus');
        //Verifiena raha mbola ao le virus
        if (virus) {
            decrypt();
            setCharge(true);

            setTimeout(() => {
                loadData(decrypt().token, decrypt().data.rm_id, decrypt().data.mention, decrypt().data.grad_id, anne_univ);
            }, 800)
        }
        else {
            logout();
        }
    }

    useEffect(() => {
        anne_univDt()
    }, [props.url]);

    useEffect(async () => {
        if (anne_univ == '0000-0000') {
            return false
        } else {
            chargementData()
        }
    }, [refreshData, anne_univ]);

    const toastTR = useRef(null);
    /*Notification Toast */
    const notificationAction = (etat, titre, message) => {
        toastTR.current.show({ severity: etat, summary: titre, detail: message, life: 10000 });
    }


    //Global filters

    const [filters1, setFilters1] = useState(null);
    const [globalFilterValue1, setGlobalFilterValue1] = useState('');
    const onGlobalFilterChange1 = (e) => {
        const value = e.target.value;
        let _filters1 = { ...filters1 };
        _filters1['global'].value = value;

        setFilters1(_filters1);
        setGlobalFilterValue1(value);
    }
    const initFilters1 = () => {
        setFilters1({
            'global': { value: null, matchMode: FilterMatchMode.CONTAINS }
        });
        setGlobalFilterValue1('');
    }
    const clearFilter1 = () => {
        initFilters1();
    }
    const renderHeader1 = () => {
        return (

            <div className="flex justify-content-between lg:flex-row md:flex-column sm:flex-column flex-column">
                <div className='flex lg:flex-row lg:col-6 md:col-7 md:flex-row sm:flex-row flex-column'>
                    <div className="lgcol-8 md:col-5   md:flex-column  sm:col-3 sm:flex-column field my-0 flex lg:flex-row flex-column">
                        <h4 htmlFor="username2" className="m-1">Anne univ :</h4>
                        <Dropdown value={anne_univ} options={selectanne} onChange={onTypesChange} name="etat" />
                    </div>

                    {/* <div className="lgcol-8 md:col-5  md:flex-column   sm:col-3 sm:flex-column field my-0 flex lg:flex-row flex-column">
                        <h4 htmlFor="username2" className="m-1">Niveau  :</h4>
                        <Dropdown value={niveau} options={selectniveau} onChange={onTypesChangeNiveau} name="etat" />
                    </div> */}
                </div>
            </div>
        )
    }
    const header1 = renderHeader1();

    //Global filters

    const stylebtnCheck = {
        fontSize: '1rem', padding: ' 0.8rem 0.5rem', backgroundColor: 'rgb(12 163 62)', border: '1px solid rgb(12 163 62)'
    };

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
            <div className='grid px-4'>
                Nombre de Groupe
            </div>
        );
    }
    /** Fin modal */

    const bodyBoutton = (data) => {
        // console.log(data)
        return (
            <Button icon={PrimeIcons.PENCIL} className='p-buttom-sm p-button-secondary p-1 ml-4' tooltip="Modifier Nombre de Groupe" tooltipOptions={{ position: 'top' }}
                onClick={() => {
                    onClick('displayBasic2');

                    loadNbreGroup(decrypt().token, anne_univ, data.nom, decrypt().data.mention, data);
                }}
            />

        );
    }

    const loadNbreGroup = (token, anne_univ, nomclasse, mention_nom, data) => {
        axios.get(props.url + `getGrouptamby/${anne_univ}/${nomclasse}/${mention_nom}`, {
            headers: {
                'Content-Type': 'text/html',
                'X-API-KEY': 'tamby',
                'Authorization': token
            }
        })
            .then(
                (result) => {
                    if (result.data.message == 'Token Time Expire.') {
                        notificationAction('warn', 'Votre token est expiré !', 'Délais de token 4 heures !')
                        setTimeout(() => {
                            logout();
                        }, 3000)
                    }
                    if (result.data != "") {
                        setinfoGroup({
                            td: result.data.td, tp: result.data.tp, mention: decrypt().data.mention, niveau: data.nom, anne_univ: anne_univ, nombre: data.count
                        });
                    } else {
                        setinfoGroup({
                            td: '0', tp: '0', mention: decrypt().data.mention, niveau: data.nom, anne_univ: anne_univ, nombre: data.count
                        });
                    }
                }
            ).catch((e) => {
                // console.log(e.message)
                if (e.message == "Network Error") {
                    props.urlip()
                }
            })
    }
    const onSaveGroupe = async () => {
        // console.log(etat)
        setCharge(true);
        try {
            await axios.post(props.url + 'postGroupeTamby', infoGroup, {
                headers: {
                    "Content-Type": "application/json; charset=utf-8",
                    "X-API-KEY": "tamby",
                    'Authorization': decrypt().token
                },
            })
                .then(res => {
                    if (res.data.message == 'Token Time Expire.') {
                        notificationAction('warn', 'Votre token est expiré !', 'Délais de token 4 heures !')
                        setTimeout(() => {
                            logout();
                        }, 3000)
                    }
                    //message avy @back
                    notificationAction(res.data.etat, res.data.situation, res.data.message);
                    setCharge(false);
                    setTimeout(() => {
                        onHide('displayBasic2');
                    }, 500)
                })
                .catch(err => {
                    notificationAction('error', 'Erreur', err.data.message);//message avy @back
                    console.log(err);
                    setCharge(false);
                });
        } catch (error) {
            notificationAction('error', 'Erreur', error.message);//message avy @back
        }

    }
    return (
        <>
            <Toast ref={toastTR} position="top-right" />
            <ConfirmDialog />
            <Dialog header={renderHeader('displayBasic2')} visible={displayBasic2} className="lg:col-3 md:col-5 col-8 p-0" onHide={() => onHide('displayBasic2')}>
                <div className="p-1  style-modal-tamby">
                    <div className='flex flex-column'>
                        <h3 className='m-1'>Classe : {infoGroup.niveau}</h3>
                        <h3 className='m-1'>Nombre des étudiants : {infoGroup.nombre}</h3>
                    </div>

                    <div className='flex flex-column'>
                        <div className='grid px-4'>
                            <div className="lg:col-6 col-12 field my-0 flex flex-column">
                                <label htmlFor="username2" className="label-input-sm">Nombre de groupe TD</label>
                                <InputNumber id="username2" value={infoGroup.td} aria-describedby="username2-help" name='td' onValueChange={(e) => { setinfoGroup({ ...infoGroup, td: e.target.value }) }} />
                            </div>
                            <div className="lg:col-6 col-12 field my-0 flex flex-column">
                                <label htmlFor="username2" className="label-input-sm">Nombre de groupe TP</label>
                                <InputNumber id="username2" value={infoGroup.tp} aria-describedby="username2-help" className="form-input-css-tamby" name='tp' onValueChange={(e) => { setinfoGroup({ ...infoGroup, tp: e.target.value }) }} />
                            </div>
                        </div>
                        <center>
                            <Button icon={PrimeIcons.SAVE} className='p-buttom-sm p-1 ml-4' label='Enregistrer' tooltipOptions={{ position: 'top' }}
                                onClick={() => { onSaveGroupe() }} />
                        </center>
                    </div>
                </div>
            </Dialog>
            <center>
                {/* <ScrollPanel style={{ height: '750px',width:'100%' }}> */}
                <DataTable value={list} loading={charge} header={header1} showGridlines={false} globalFilterFields={['matiere', 'unite_ens', 'seme_code', 'abbr_niveau']} filters={filters1} rows={10} rowsPerPageOptions={[10, 20, 50]} paginator autoLayout emptyMessage={'Aucun resultat trouvé'}>
                    <Column field={'nom'} header={'Classe'} style={{ fontWeight: '600' }}></Column>
                    <Column field='count' header={'Nombre étudiants'} style={{ fontWeight: '600' }}></Column>
                    <Column header="Groupe" body={bodyBoutton} align={'center'}></Column>
                </DataTable>
                {/* </ScrollPanel> */}
            </center>
        </>
    )
}
