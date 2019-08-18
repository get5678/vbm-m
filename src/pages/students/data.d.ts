export interface StudentsItem {
  user_id: number;
  user_name: string;
  user_sex: number;  // 0:男 1：女
  user_phone: string;
  user_admin_id: number;
}

export interface StudentListData {
  data: StudentsItem[],
  total: number
}

export interface TableListItem {
  user_id: number;
  user_name: string;
  user_sex: number;  // 0:男 1：女
  user_phone: string;
  user_admin_id: number;
  disabled?: boolean;
}

export interface TableListPagination {
  total: number;
  pageSize: number;
  current: number;
}

export interface TableListData {
  list: TableListItem[];
  pagination: Partial<TableListPagination>;
}

export interface TableListParams {
  sorter: string;
  status: string;
  name: string;
  pageSize: number;
  currentPage: number;
}
