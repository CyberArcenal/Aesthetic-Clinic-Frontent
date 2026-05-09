import React from 'react';
import Modal from './Modal'; 
import Map from '@/components/UI/Map';

interface MapModalProps {
  isOpen: boolean;
  onClose: () => void;
  coordinates: string; // "lat,lng"
  address: string;
}

const MapModal: React.FC<MapModalProps> = ({ isOpen, onClose, coordinates, address }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Location Map"
      size="lg"       // pwede ring "xl" kung gusto mo mas malaki
      showCloseButton={true}
      closeOnClickOutside={true}
    >
      <div className="h-96 w-full">
        <Map coordinates={coordinates} address={address} />
      </div>
    </Modal>
  );
};

export default MapModal;