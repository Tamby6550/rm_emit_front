import React, { useState, useEffect, useRef } from 'react'
import { TabView, TabPanel } from 'primereact/tabview';
import Affichage from './Affichage';
import TableauA from './TableauA';
import TableauB from './TableauB';
export default function MenuAffichage(props) {
  const [activeIndex, setActiveIndex] = useState(0);


  
  return (
    <div className="tabview-demo">
      <div className="card">
        <TabView activeIndex={activeIndex} onTabChange={(e)=>{ setActiveIndex(e.index) }} >
          <TabPanel header="LISTE DES DISCIPLINES ENSEIGNEES"   >
            <Affichage url={props.url}  activeIndex={activeIndex} setActiveIndex={setActiveIndex} />
          </TabPanel>
          <TabPanel header="TABLEAU A">
            <TableauA url={props.url}  activeIndex={activeIndex} setActiveIndex={setActiveIndex} />
          </TabPanel>
          <TabPanel header="TABLEAU B">
            <TableauB url={props.url}  activeIndex={activeIndex} setActiveIndex={setActiveIndex} />
          </TabPanel>
        </TabView>
      </div>
    </div>
  )
}

