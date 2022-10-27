import { SideLink, Actions } from '@twilio/flex-ui';

interface Props {
  activeView?: string;
  key: string;
}

export default ({ activeView }: Props) => {
  function navigate() {
    Actions.invokeAction('NavigateToView', { viewName: 'agent-timeline' });
  }

  return (
    <SideLink showLabel={true} icon="Supervisor" iconActive="SupervisorBold" isActive={activeView === 'agent-timeline'} onClick={navigate}>
      Agents Timeline
    </SideLink>
  );
};
