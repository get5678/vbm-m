export interface loginInfo {
    phone: string;
    password: string;
}

export interface registerAdminInfo {
    phone: string;
    password: string;
    name: string;
}

export interface registerUserInfo {
    userPhone: string;
    userPassword: string;
    userName: string;
    userSex: number;
}
export interface getList {
    current: number;
    pageSize: number;
}
export interface getStuSearch {
    name: string;
}
export interface Code {
    code: number;
    data: any;
    msg: string;
}
export interface deleteInfo {
    userId: number;
}
export interface interviewItem{
    interviewId: number;
    interviewTimes?: number; //第几次面试
    interviewStudyAbility?: number;
    interviewChatAbility?: number;
    interviewDigAbility?: number;
    interviewSumAbility?: number;
    interviewUserId?: number;
    interviewIsStay?: number;
    interviewFuture?: number;
    interviewEvaluation?: string;
}

export interface interviewSearchInfo{
    userName?: string;
    adminName?: string;
}

export interface questionSearchInfo{
    current?: number;
    pageSize?: number;
    type: number;
}

export interface queationAddInfo{
    file: any;
    type: number;
    detail: string;
    grade: number;
    userId: number;
}