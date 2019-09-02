export interface StudentsItem {
  userId: number;
  userName: string;
  userSex: number;  // 0:男 1：女
  userPhone: string;
  user_admin_id: number;
}

export interface StudentListData {
  list: StudentsItem[],
  current: number,
  pageSize: number,
  total: number
}

export interface TableListItem {
  userId: number;
  userName: string;
  userSex: number;  // 0:男 1：女
  userPhone: string;
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
