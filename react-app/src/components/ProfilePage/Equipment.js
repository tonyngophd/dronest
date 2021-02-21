import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import fetchAFollowing from "../../store/follow";
import { useDispatch, useSelector } from "react-redux";

import './ProfilePage.css';
import { nanoid } from "nanoid";


export function EquipmentCard({ equipment }) {

  return (
    <div>
      {equipment.name}
      <img src={equipment.mediaUrl} 
        alt={equipment.mediaUrl} 
        className='equipment-img'
      />
    </div>
  );
}

export function EquipmentDiv({ equipmentList }) {

  return (
    <div>
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