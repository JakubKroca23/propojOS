import { useEventStore } from '../store/eventStore';

export function useAppInput<T = any>(appId: string, portName: string): T | undefined {
  return useEventStore((state) => state.inputs[appId]?.[portName]);
}

export function useAppOutput(appId: string, portName: string) {
  const emit = useEventStore((state) => state.emit);
  
  return (data: any) => {
    emit(appId, portName, data);
  };
}
