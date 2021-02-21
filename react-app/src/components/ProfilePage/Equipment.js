import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import fetchAFollowing from "../../store/follow";
import { useDispatch, useSelector } from "react-redux";

import './ProfilePage.css';
import { nanoid } from "nanoid";


export function EquipmentCard({ equipment }) {

  return (
    <div className='equipment_card_div'>
      <img src={equipment.mediaUrl}
        alt={equipment.mediaUrl}
        className='equipment-img'
      />
      <div className='equipment_name_div'>
        {equipment.name}
      </div>
    </div>
  );
}

export function EquipmentDiv({ equipmentList }) {

  return (
    <div className='equipment_list_container'>
      {
        equipmentList.map(eq =>
          <EquipmentCard
            equipment={eq}
            key={nanoid()}
          />
        )}
    </div>
  );
}