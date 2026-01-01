import {AdminHistoryList} from "../components/AdminHistoryList.tsx";
import {AdminReportList} from "../components/AdminReportList.tsx";
import {AdminUserList} from "../components/AdminUserList.tsx";
import {AdminHeaderAndSidebar} from "../components/AdminHeaderAndSidebar.tsx";

export function Admin(){
  return(
      <div>
          <AdminHeaderAndSidebar></AdminHeaderAndSidebar>
          <AdminReportList/>
      </div>
  );
}
