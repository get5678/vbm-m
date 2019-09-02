interface GradeInfo{
    label: string;
    grade: number;
}

export function acculateGeade(info: GradeInfo): string {
    let degree = '';
    if (info.label === 'interviewTimes') {
        return ''
    }
    switch(info.grade) {
        case 10:
        case 9:
            degree = '优秀';
            break;
        case 8: 
        case 7:
            degree = '良好';
            break;
        case 6:
        case 5:
            degree = '中等';
            break;
        case 4:
        case 3:
            degree = '低等';
            break;
        default:
            break;
    }
    return degree;
}