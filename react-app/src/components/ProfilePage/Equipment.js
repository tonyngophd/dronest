import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import fetchAFollowing from "../../store/follow";
import { useDispatch, useSelector } from "react-redux";

import './ProfilePage.css';
import { nanoid } from "nanoid";


export function EquipmentCard({ equipment }) {

  return (
    <div className='equipment_card_div'>
      <div className='equipment_card_innver_div'>
      <img src={equipment.mediaUrl}
        alt={equipment.mediaUrl}
        className='equipment-img'
      />
      <div className='equipment_name_div'>
        {equipment.name}
      </div>
      </div>
    </div>
  );
}

export function EquipmentDiv({ equipmentList }) {

  return (
    <div className='equipment_list_container'>
      {
        equipmentList
          .sort((a, b) =>
            a.level < b.level ? 1 : -1)
          .map(eq =>
            <EquipmentCard
              equipment={eq}
              key={nanoid()}
            />
          )}
    </div>
  );
}