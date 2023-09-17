import React, { useState, useEffect, useRef } from 'react'
import 'primeicons/primeicons.css';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';
import axios from 'axios';
import useAuth from './useAuth';
import * as Components from './Components';
import emit from './images/emit.png'
import { Toast } from 'primereact/toast';


export default function Signin(props) {

    const { login, notif, chargement, inscriptionlogin } = useAuth();

    const [signIn, toggle] = React.useState(true);
    const [infoLogin, setinfoLogin] = useState({ rm_nom: '', mention: '', grad_id: '', motpasse: '' });
    const [infoInscription, setinfoInscription] = useState({ rm_nom: '', mention_nom: '', grad_id: '', rm_mdp: '' });
    const [grade, setgrade] = useState([{ grad_id: '', grad_nom: '' }]);
    const [mention, setmention] = useState([{ mention_nom: '', mention_lib: '' }]);
    const [charge, setCharge] = useState(false);
    const [refreshData, setrefreshData] = useState(0);
    const [verfadmin, setverfadmin] = useState(false);

    const [verfChamp, setverfChamp] = useState({ rm_nom: false, mention: false, grad_id: false, motpasse: false })
    const [verfChampIns, setverfChampIns] = useState({ rm_nom: false, mention: false, grad_id: false, motpasse: false })
    const onChargeDonne = (e) => {
        setinfoLogin({ ...infoLogin, [e.target.name]: e.target.value })
    }
    const onChargeDonneInscription = (e) => {
        setinfoInscription({ ...infoInscription, [e.target.name]: e.target.value })
    }
    const loadData = async () => {
        try {
            await axios.get(props.url + `getGradeMention`, {
                headers: {
                    'Content-Type': 'text/html',
                    'X-API-KEY': 'tamby'
                }
            })
                .then(
                    (result) => {
                        setgrade(result.data.grade);
                        setmention(result.data.mention);
                        setrefreshData(0);
                        setCharge(false);
                    }
                );
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        setCharge(true);
        setTimeout(() => {
            loadData();
        }, 800)
    }, [refreshData, props.url]);

    useEffect(() => {
        if (infoLogin.mention == 'Admin') {
            setverfadmin(true);
        } else {
            setverfadmin(false);
        }
    }, [infoLogin.mention])


    /*Notification Toast */
    const toastTR = useRef(null);
    const notificationAction = (etat, titre, message) => {
        toastTR.current.show({ severity: etat, summary: titre, detail: message, life: 3000 });
    }

    useEffect(() => {
        if (notif.etat != '') {
            notificationAction(notif.etat, notif.situation, notif.message);
        }
    }, [notif])

    const onverfCh = () => {
        if (infoLogin.mention == "") {
            setverfChamp({ rm_nom: false, grad_id: false, motpasse: false, mention: true });
        }

        if (infoLogin.grad_id == "" && !verfadmin) {
            setverfChamp({ rm_nom: false, mention: false, motpasse: false, grad_id: true });
        }

        if (infoLogin.motpasse == "") {
            setverfChamp({ rm_nom: false, mention: false, grad_id: false, motpasse: true });
        }

        if (verfadmin) {
            if (infoLogin.mention != "" && infoLogin.motpasse != "") {
                setverfChamp({ mention: false, grad_id: false, motpasse: false, rm_nom: false });
                onSub();
            }
        }else{
            if (infoLogin.mention != "" && infoLogin.grad_id != "" && infoLogin.motpasse != "") {
                setverfChamp({ mention: false, grad_id: false, motpasse: false, rm_nom: false });
                onSub();
            }
        }
    }

    const onverfChInscription = () => {
        if (infoInscription.mention_nom == "") {
            setverfChampIns({ rm_nom: false, grad_id: false, motpasse: false, mention: true });
        }
        if (infoInscription.grad_id == "") {
            setverfChampIns({ rm_nom: false, mention: false, motpasse: false, grad_id: true });
        }

        if (infoInscription.rm_mdp == "") {
            setverfChampIns({ rm_nom: false, mention: false, grad_id: false, motpasse: true });
        }
        if (infoInscription.rm_nom == "") {
            setverfChampIns({ mention: false, grad_id: false, motpasse: false, rm_nom: true });
        }
        if (infoInscription.mention_nom != "" && infoInscription.grad_id != "" && infoInscription.rm_mdp != "" && infoInscription.rm_nom != "") {
            setverfChampIns({ mention: false, grad_id: false, motpasse: false, rm_nom: false });
            onInscription();
        }
    }

    //Login
    const onSub = () => {
        login(infoLogin, props.url)
    }

    //Inscription de donnees vers ci
    const onInscription = () => {
        inscriptionlogin(infoInscription, props.url)
        // console.log(infoInscription)
        // login(infoLogin, props.url)
    }


    return (
        <div className='flex flex-row justify-content-center  align-items-center m-0 w-full '>
            <Toast ref={toastTR} position="top-center" />
            <Components.Container class='.login-page' >
                <Components.SignUpContainer signinIn={signIn}>
                    <Components.Form>
                        <Components.Title>Création du compte</Components.Title>
                        <Components.Input type='text' className={verfChampIns.rm_nom ? "fform-invalid" : ''} placeholder='Nom utilisateur' style={{ marginBottom: '20px' }} name='rm_nom' onChange={(e) => { onChargeDonneInscription(e) }} />
                        {verfChampIns.rm_nom ? <small id="username2-help" className="p-error block">Champ vide !</small> : null}
                        <Components.Input type='password' placeholder='Password' className={verfChampIns.motpasse ? "fform-invalid" : ''} name='rm_mdp' onChange={(e) => { onChargeDonneInscription(e) }} />
                        {verfChampIns.motpasse ? <small id="username2-help" className="p-error block">Champ vide !</small> : null}

                        <Components.Label >Grade </Components.Label>
                        <Components.Select name='grad_id' onChange={(e) => { onChargeDonneInscription(e) }} className={verfChampIns.grad_id ? "fform-invalid" : ''} >
                            <Components.Option value={''}  >{charge ? 'Chargement...' : ''}</Components.Option>
                            {grade.map((gr, index) => (
                                <Components.Option value={gr.grad_id} key={index} >{gr.grad_nom}</Components.Option>
                            ))}
                        </Components.Select>
                        {verfChampIns.grad_id ? <small id="username2-help" className="p-error block">Champ vide !</small> : null}
                        <Components.Label >Mention</Components.Label>
                        <Components.Select name='mention_nom' onChange={(e) => { onChargeDonneInscription(e) }} className={verfChampIns.mention ? "fform-invalid" : ''}  >
                            <Components.Option value={''}  >{charge ? 'Chargement...' : ''}</Components.Option>
                            {mention.map((mt, index) => (
                                <Components.Option value={mt.mention_nom} key={index} >{mt.mention_nom}</Components.Option>
                            ))}
                        </Components.Select>
                        {verfChampIns.mention ? <small id="username2-help" className="p-error block">Champ vide !</small> : null}
                        <Components.Button onClick={() => { onverfChInscription() }}>{chargement ? '...' : 'Inscrire'}</Components.Button>
                    </Components.Form>
                </Components.SignUpContainer>

                <Components.SignInContainer signinIn={signIn}>
                    <Components.Form>
                        <Components.Title>Login</Components.Title>

                        <Components.Label >Mention</Components.Label>
                        <Components.Select name='mention' onChange={(e) => { onChargeDonne(e) }} className={verfChamp.mention ? "fform-invalid" : ''}  >
                            <Components.Option value={''}  >{charge ? 'Chargement...' : ''}</Components.Option>
                            {mention.map((mt, index) => (
                                <Components.Option value={mt.mention_nom} key={index} >{mt.mention_nom}</Components.Option>
                            ))}
                        </Components.Select>
                        {verfChamp.mention ? <small id="username2-help" className="p-error block">Champ vide !</small> : null}

                        {verfadmin ? null :
                            <>
                                <Components.Label >Grade </Components.Label>
                                <Components.Select name='grad_id' onChange={(e) => { onChargeDonne(e) }} className={verfChamp.grad_id ? "fform-invalid" : ''} >
                                    <Components.Option value={''}  >{charge ? 'Chargement...' : ''}</Components.Option>
                                    {grade.map((gr, index) => (
                                        <Components.Option value={gr.grad_id} key={index} >{gr.grad_nom}</Components.Option>
                                    ))}
                                </Components.Select>
                                {verfChamp.grad_id ? <small id="username2-help" className="p-error block">Champ vide !</small> : null}
                            </>
                        }
                        <Components.Label >Mot de passe </Components.Label>
                        <Components.Input type='password' placeholder='Password' className={verfChamp.motpasse ? "fform-invalid" : ''} name='motpasse' onChange={(e) => { onChargeDonne(e) }} />
                        {verfChamp.motpasse ? <small id="username2-help" className="p-error block">Champ vide !</small> : null}
                        <Components.Button onClick={() => { onverfCh() }} className='chargement-login mt-5' > {chargement ? '...' : 'Connecter'} </Components.Button>
                    </Components.Form>
                </Components.SignInContainer>

                <Components.OverlayContainer signinIn={signIn}>
                    <Components.Overlay signinIn={signIn}>
                        <Components.LeftOverlayPanel signinIn={signIn}>
                            <Components.Title>Page d'inscription</Components.Title>
                            <Components.Paragraph>
                                Choississez vos informations
                            </Components.Paragraph>
                            <Components.GhostButton onClick={() => toggle(true)}>
                                Se connecter
                            </Components.GhostButton>
                        </Components.LeftOverlayPanel>

                        <Components.RightOverlayPanel signinIn={signIn}>
                            <Components.Title style={{ color: '#546372', fontSize: '1.6em' }} >Application pour le suivi pédagogique</Components.Title>
                            <Components.Paragraph>
                                <img src={emit} alt="" width={"148px"} />
                            </Components.Paragraph>
                            <Components.GhostButton style={{ display: 'block' }} onClick={() => toggle(false)}>
                                S'inscrire
                            </Components.GhostButton>
                        </Components.RightOverlayPanel>

                    </Components.Overlay>
                </Components.OverlayContainer>

            </Components.Container>
        </div>
    );
}
