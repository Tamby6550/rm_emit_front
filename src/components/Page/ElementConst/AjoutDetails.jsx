import React, { useState, useEffect, useRef } from 'react'
import { Button } from 'primereact/button'
import { PrimeIcons } from 'primereact/api';
import { InputText } from 'primereact/inputtext'
import { Toast } from 'primereact/toast';
import { InputNumber } from 'primereact/inputnumber';
import { Checkbox } from 'primereact/checkbox';
import { Dropdown } from 'primereact/dropdown';
/*Importer modal */
import { Dialog } from 'primereact/dialog';
import axios from 'axios'
import { Fieldset } from 'primereact/fieldset';
import { BlockUI } from 'primereact/blockui';
import { ProgressSpinner } from 'primereact/progressspinner';

export default function AjoutDetails(props) {


    const [chargeDnn, setchargeDnn] = useState(false);
    //Declaration useSatate
    const [infoDetails, setinfoDetails] = useState({ diviser_td: '', diviser_tp: '', anne_univ: '', base_et: '0', group_et: '1', base_ed: '0', group_ed: '0', base_ep: '0', group_ep: '0', vheure: '0', credit: '0', mati_id: '' });
    const [chek, setchek] = useState(true);
    const [chek1, setchek1] = useState(true);
    const [chek2, setchek2] = useState(true);
    const [verfChamp, setverfChamp] = useState({ vheure: false });
    const [charge, setcharge] = useState(false);
    const onVideInfo = () => {
        setchek(true);
        setchek1(true);
        setchek2(true);
        setinfoDetails({ diviser_td: '', diviser_tp: '', anne_univ: '', base_et: '0', group_et: '1', base_ed: '0', group_ed: '0', base_ep: '0', group_ep: '0', vheure: '0', credit: '0', mati_id: '' });
    }


    //Affichage notification Toast primereact (del :3s )
    const toastTR = useRef(null);
    const notificationAction = (etat, titre, message) => {
        toastTR.current.show({ severity: etat, summary: titre, detail: message, life: 3000 });
    }

    const [selecttarif, setselecttarif] = useState(null);
    const [selecttype, setselecttype] = useState(null);
    const onTarifChange = (e) => {
        setselecttarif(e.value);
        setinfoDetails({ ...infoDetails, [e.target.name]: (e.target.value) });
    }
    const onTypesChange = (e) => {
        setselecttype(e.value);
        setinfoDetails({ ...infoDetails, [e.target.name]: (e.target.value) });
    }
    const onInfoDetails = (e) => {
        setinfoDetails({ ...infoDetails, [e.target.name]: (e.target.value) })
    }




    const stylebtnRec = {
        fontSize: '1rem', padding: ' 0.8375rem 0.975rem', backgroundColor: 'rgb(72 96 112)', border: '1px solid rgb(72 96 112)'
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
        setverfChamp({ id_exam: false, lib: false, code_tarif: false, type: false, montant: false, tarif: false });
        onVideInfo();
        setselecttype(null);
        setselecttarif(null);
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
                <h4 className='mb-1'>Ajout details(En cours de developpement) </h4>
                <hr />
            </div>
        );
    }
    /** Fin modal */


    const verf = () => {
        if (chek) {
            setinfoDetails({ ...infoDetails, base_et: '0' });
        }
        if (chek1) {
            setinfoDetails({ ...infoDetails, base_ed: '0' });
        }
        if (chek2) {
            setinfoDetails({ ...infoDetails, base_ep: '0' });
        }
    }

    const controleChampVide = () => {
        if (infoDetails.vheure == "0" || infoDetails.vheure == "") {
            alert('Volume d\'heure ne doit pas etre vide ou zéro !');
        }
        if (infoDetails.group_ed == "0" && infoDetails.group_ep == "0") {
            alert('Vous devez configurer le nombre de groupe de cette classe dans le menu paramètre !')
        }
        else {
            setverfChamp({ vheure: false });
            onSub()
        }
    }

    const onSub = async () => { //Ajout de donnees vers Laravel
        // console.log(etat)
        setcharge(true);
        try {
            await axios.post(props.url + 'ajouteDetailsMatiere', infoDetails, {
                headers: {
                    "Content-Type": "application/json; charset=utf-8",
                    "X-API-KEY": "tamby",
                    'Authorization': props.token
                },
            })
                .then(res => {
                    if (res.data.message == 'Token Time Expire.') {
                        notificationAction('warn', 'Votre token est expiré !', 'Délais de token 4 heures !')
                        setTimeout(() => {
                            props.logout();
                        }, 3000)
                    }
                    //message avy @back
                    notificationAction(res.data.etat, res.data.situation, res.data.message);
                    setcharge(false);
                    setTimeout(() => {
                        onHide('displayBasic2');
                        props.setrefreshData(1);
                    }, 500);
                })
                .catch(err => {
                    notificationAction('error', 'Erreur', err.data.message);//message avy @back
                    console.log(err);
                    setcharge(false);
                });
        } catch (error) {
            notificationAction('error', 'Erreur', error.message);//message avy @back
        }
    }
    const loadNbreGroup = () => {
        setchargeDnn(true);
        axios.get(props.url + `getGrouptamby/${props.anne_univ}/${props.grad_id}/${props.mention}`, {
            headers: {
                'Content-Type': 'text/html',
                'X-API-KEY': 'tamby',
                'Authorization': props.token
            }
        })
            .then(
                (result) => {
                    if (result.data.message == 'Token Time Expire.') {
                        notificationAction('warn', 'Votre token est expiré !', 'Délais de token 4 heures !')
                        setTimeout(() => {
                            props.logout();
                        }, 3000)
                    }
                    if (result.data != "") {
                        setinfoDetails({
                            ...infoDetails, diviser_td: result.data.diviser_td, diviser_tp: result.data.diviser_tp,
                            anne_univ: props.anne_univ, mati_id: props.data.mati_id
                        })
                        loadDetailsTamby(result);

                    } else {
                        setchargeDnn(false);
                    }
                }
            ).catch((e) => {
                // console.log(e.message)
                if (e.message == "Network Error") {
                    props.urlip()
                }
                setchargeDnn(false);
            })
    }
    const loadDetailsTamby = (resultss) => {
        axios.get(props.url + `getDetailsMatiere/${props.anne_univ}/${props.data.mati_id}`, {
            headers: {
                'Content-Type': 'text/html',
                'X-API-KEY': 'tamby',
                'Authorization': props.token
            }
        })
            .then(
                (result) => {
                    if (result.data.message == 'Token Time Expire.') {
                        notificationAction('warn', 'Votre token est expiré !', 'Délais de token 4 heures !')
                        setTimeout(() => {
                            props.logout();
                        }, 3000)
                    }
                    if (result.data != "") {

                        diviserNbGroupe(props.nbreClasse.nmbre_classe, resultss.data.diviser_td, resultss.data.diviser_tp, result)

                    }
                    setchargeDnn(false);
                }
            ).catch((e) => {
                // console.log(e.message)
                if (e.message == "Network Error") {
                    props.urlip()
                }
                setchargeDnn(false);
            })
    }

    function getResult(num, denom) {
        const result = num / denom;
        if (result % 1 !== 0) {
            return Math.ceil(result);
        }
        return result;
    }

    function diviserNbGroupe(nbreEtud, div_td, div_tp, resultat) {
        setinfoDetails({
            ...infoDetails,
            vheure: props.data.vheure, credit: props.data.credit,
            anne_univ: props.anne_univ, group_et: resultat.data.group_et, mati_id: props.data.mati_id,
            base_ed: resultat.data.base_ed, base_et: resultat.data.base_et, base_ep: resultat.data.base_ep,
            group_ed: getResult(nbreEtud, div_td), group_ep: getResult(nbreEtud, div_tp) 
        });
    }


    return (
        <div>
            <Toast ref={toastTR} position="top-right" />
            <Button icon={PrimeIcons.PLUS} className='p-buttom-sm p-1 ' label='' style={stylebtnRec} tooltip='Ajouter details' tooltipOptions={{ position: 'top' }}
                onClick={() => {
                    onClick('displayBasic2');
                    setTimeout(() => {
                        loadNbreGroup();

                    }, 200);
                    setTimeout(() => {
                    }, 400);

                }}
            />
            <div className='grid'>
                <Dialog header={renderHeader('displayBasic2')} visible={displayBasic2} className="lg:col-4 md:col-8 col-9 p-0" footer={renderFooter('displayBasic2')} onHide={() => onHide('displayBasic2')}>
                    <BlockUI blocked={chargeDnn} template={<ProgressSpinner />}>
                        <div className="p-1 style-modal-tamby" style={{ fontSize: '0.9em' }} >
                            <div className='flex flex-column'>
                                <h2 className='m-1'>Matière : <u>{props.data.matiere}</u> </h2>
                                <h2 className='m-1'> Proff : <u>{props.data.nom_prof}</u> </h2>
                            </div>
                            <hr />
                            <form className='flex flex-column justify-content-center'>

                                <div className='grid px-4 flex justify-content-center'>
                                    <div className="lg:col-4 col-12 field my-0 flex flex-column">
                                        <h4 className='m-1'>Volmue d'heure</h4>
                                        <InputNumber inputId="withoutgrouping" value={infoDetails.vheure} name="vheure" onValueChange={onInfoDetails} mode="decimal" useGrouping={false} className={verfChamp.vheure ? "form-input-css-tamby p-invalid" : "form-input-css-tamby"} />
                                    </div>
                                    <div className="lg:col-4 col-12 ml-3 field my-0 flex flex-column">
                                        <h4 className='m-1'>Credit</h4>
                                        <InputNumber inputId="withoutgrouping" value={infoDetails.credit} name="credit" onValueChange={onInfoDetails} mode="decimal" useGrouping={false} className={verfChamp.vheure ? "form-input-css-tamby p-invalid" : "form-input-css-tamby"} />
                                    </div>
                                </div>
                                <div className='grid px-4'>
                                    <div className="lg:col-12 col-12 field my-0 flex flex-column">
                                        <Fieldset legend="Enseignement Théorique "  >
                                            <Checkbox checked={chek} onChange={() => { setchek(!chek); verf(); }} />
                                            <div className='grid p-1'>
                                                <div className="lg:col-6 col-12 field my-0 flex flex-column">
                                                    <h4 className='m-1'>Base</h4>
                                                    <InputNumber inputId="withoutgrouping" value={infoDetails.base_et} name="base_et" onValueChange={onInfoDetails} mode="decimal" useGrouping={false} className={verfChamp.vheure ? "form-input-css-tamby p-invalid" : "form-input-css-tamby"} disabled={!chek} />
                                                </div>
                                                <div className="lg:col-6 col-12 field my-0 flex flex-column">
                                                    <h4 className='m-1'>Groupe</h4>
                                                    <InputNumber inputId="withoutgrouping" value={infoDetails.group_et} name="group_et" onValueChange={onInfoDetails} mode="decimal" useGrouping={false} className={verfChamp.vheure ? "form-input-css-tamby p-invalid" : "form-input-css-tamby"} disabled={!chek} readOnly />
                                                </div>
                                                {/* <div className="lg:col-4 col-12 field my-0 flex flex-column">
                                                <h4 className='m-1'>Total</h4>
                                                <InputNumber inputId="withoutgrouping" value={infoDetails.} name="vheure" onValueChange={onInfoDetails} mode="decimal" useGrouping={false} readOnly />
                                            </div> */}
                                            </div>
                                        </Fieldset>
                                    </div>
                                </div>
                                <div className='grid px-4'>
                                    <div className="lg:col-12 col-12 field my-0 flex flex-column">
                                        <Fieldset legend="Enseignement Dirigé "  >
                                            <Checkbox checked={chek1} onChange={() => { setchek1(!chek1); verf(); }} />
                                            <div className='grid p-1'>
                                                <div className="lg:col-6 col-12 field my-0 flex flex-column">
                                                    <h4 className='m-1'>Base</h4>
                                                    <InputNumber inputId="withoutgrouping" value={infoDetails.base_ed} name="base_ed" onValueChange={onInfoDetails} mode="decimal" useGrouping={false} className={verfChamp.vheure ? "form-input-css-tamby p-invalid" : "form-input-css-tamby"} disabled={!chek1} />
                                                </div>
                                                <div className="lg:col-6 col-12 field my-0 flex flex-column">
                                                    <h4 className='m-1'>Groupe</h4>
                                                    <InputNumber inputId="withoutgrouping" value={infoDetails.group_ed} name="group_ed" onValueChange={onInfoDetails} mode="decimal" useGrouping={false} className={verfChamp.vheure ? "form-input-css-tamby p-invalid" : "form-input-css-tamby"} disabled={!chek1} readOnly />
                                                </div>
                                                {/* <div className="lg:col-4 col-12 field my-0 flex flex-column">
                                                <h4 className='m-1'>Total</h4>
                                                <InputNumber inputId="withoutgrouping" value={infoDetails.vheure} name="vheure" onValueChange={onInfoDetails} mode="decimal" useGrouping={false} readOnly />
                                            </div> */}
                                            </div>
                                        </Fieldset>
                                    </div>
                                </div>
                                <div className='grid px-4'>
                                    <div className="lg:col-12 col-12 field my-0 flex flex-column">
                                        <Fieldset legend="Enseignement Pratique "  >
                                            <Checkbox checked={chek2} onChange={() => { setchek2(!chek2); verf(); }} />
                                            <div className='grid p-1'>
                                                <div className="lg:col-6 col-12 field my-0 flex flex-column">
                                                    <h4 className='m-1'>Base</h4>
                                                    <InputNumber inputId="withoutgrouping" value={infoDetails.base_ep} name="base_ep" onValueChange={onInfoDetails} mode="decimal" useGrouping={false} className={verfChamp.vheure ? "form-input-css-tamby p-invalid" : "form-input-css-tamby"} disabled={!chek2} />
                                                </div>
                                                <div className="lg:col-6 col-12 field my-0 flex flex-column">
                                                    <h4 className='m-1'>Groupe</h4>
                                                    <InputNumber inputId="withoutgrouping" value={infoDetails.group_ep} name="group_ep" onValueChange={onInfoDetails} mode="decimal" useGrouping={false} className={verfChamp.vheure ? "form-input-css-tamby p-invalid" : "form-input-css-tamby"} disabled={!chek2} readOnly />
                                                </div>
                                                {/* <div className="lg:col-4 col-12 field my-0 flex flex-column">
                                                <h4 className='m-1'>Total</h4>
                                            </div> */}
                                            </div>
                                        </Fieldset>
                                    </div>
                                </div>



                            </form>
                            <div className='flex mt-3 mr-4 justify-content-center'>
                                <Button icon={PrimeIcons.SAVE} className='p-button-sm p-button-primary ' label={charge ? 'Enregistrement...' : 'Enregistrer'} onClick={() => {
                                    controleChampVide()
                                }} />
                            </div>
                        </div>
                    </BlockUI>
                </Dialog>
            </div>
        </div>
    )
}
