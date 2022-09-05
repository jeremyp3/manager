import React from 'react';
import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  ModalOverlay,
  useDisclosure,
} from '@chakra-ui/react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { dedicatedServerIpmiRestart } from '@/api/dedicatedServer';
import useDedicatedServerTasks from '@/hooks/useDedicatedServerTasks';

export default function NodeIpmiRestart(): JSX.Element {
  const { isOpen } = useDisclosure({
    isOpen: true,
  });
  const { t } = useTranslation('node-ipmi');
  const { nodeId } = useParams();
  const { reload: reloadTasks } = useDedicatedServerTasks(nodeId);
  const navigate = useNavigate();
  const onClose = () => navigate('..');
  const onRestart = () => {
    dedicatedServerIpmiRestart(nodeId).then(() => {
      onClose();
      reloadTasks();
    });
  };
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay opacity={0.5} />
      <ModalContent>
        <ModalHeader>{t('ipmi_restart_title')}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>{t('ipmi_restart_confirm')}</ModalBody>
        <ModalFooter>
          <Button variant="primary" onClick={onClose} mr={2}>
            {t('common:cancel')}
          </Button>
          <Button variant="secondary" onClick={onRestart}>
            {t('common:confirm')}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
