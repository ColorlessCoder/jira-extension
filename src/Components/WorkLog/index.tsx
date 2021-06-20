import { useEffect } from 'react';
import SplitterLayout from 'react-splitter-layout';
import 'react-splitter-layout/lib/index.css';
import { useAppDispatch } from '../../hooks/storeHooks';
import { actions } from '../../store/actions';
import { DayWiseWorkLog } from './DayWiseWorkLog';
import WeeklyWorklogs from './WeeklyWorklogs';

export function WorkLog() {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(actions.mainMenu.setHeaderTitle("Work Log"))
    console.log("Use Effect")
  }, [dispatch])
  console.log("Normal Load")
  return (
    <SplitterLayout percentage={true} vertical={false} secondaryInitialSize={25}>
      <div style={{padding: 10}}>
        <DayWiseWorkLog />
      </div>
      <SplitterLayout percentage={true} vertical={true} secondaryInitialSize={30}>
        <div style={{padding: 10}}>
          <WeeklyWorklogs />
        </div>
        <div />
      </SplitterLayout>
    </SplitterLayout>
  );
}
