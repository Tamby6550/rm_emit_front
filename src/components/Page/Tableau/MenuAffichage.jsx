import React, { useState, useEffect, useRef } from 'react'
import { TabView, TabPanel } from 'primereact/tabview';
import Affichage from './Affichage';
import TableauA from './TableauA';
import TableauFinale from './TableauFinale';
import Tableau1 from '../Tableau/Tableau1/Tableau1';
export default function MenuAffichage(props) {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="tabview-demo">
      <div className="card">
        <TabView activeIndex={activeIndex} onTabChange={(e)=>{ setActiveIndex(e.index) }} >
          <TabPanel header="TABLEAU 1"   >
            <Tableau1 url={props.url} urlip={props.urlip} activeIndex={activeIndex} setActiveIndex={setActiveIndex} />
          </TabPanel>
          <TabPanel header="LISTE DES DISCIPLINES ENSEIGNEES"   >
            <Affichage url={props.url} urlip={props.urlip} activeIndex={activeIndex} setActiveIndex={setActiveIndex} />
          </TabPanel>
          <TabPanel header="TABLEAU A">
            <TableauA url={props.url} urlip={props.urlip} activeIndex={activeIndex} setActiveIndex={setActiveIndex} />
          </TabPanel>
          <TabPanel header="TABLEAU GLOBAL">
            <TableauFinale url={props.url} urlip={props.urlip} activeIndex={activeIndex} setActiveIndex={setActiveIndex} />
          </TabPanel>
        </TabView>
      </div>
    </div>
  )
}

