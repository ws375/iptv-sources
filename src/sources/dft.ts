import {
    collectM3uSource
} from './utils';
import {
    handle_m3u,
    ISource,
    type TSources
} from './utils';

// 统一过滤逻辑：提取包含 #EXTINF 的有效行
export const local_filter: ISource['filter'] = (
    raw,
    caller,
    collectFn
): [string, number] => {
    const rawArray = handle_m3u(raw);
    const result = rawArray.filter((r) => /^#EXTINF/.test(r));

    if (caller === 'normal' && collectFn) {
        for (let i = 0; i < result.length; i += 2) {
            collectM3uSource(result[i], result[i + 1], collectFn);
        }
    }

    return [result.join('\n'), (result.length - 1) / 2];
};

// 定义你要求的北京、天津、山西、辽宁、吉林、黑龙江及央卫视源
export const local_sources: TSources = [

    {
        name: '北京地方台专线',
        f_name: 'beijing_local',
        // 专门针对北京联通/移动的 IPTV 提取源
        url: 'https://raw.githubusercontent.com/qwerttvv/Beijing-IPTV/master/IPTV-Unicom.m3u',
        filter: local_filter,
    },
    {
        name: '北方六省地方台(辽吉黑晋津)',
        f_name: 'northern_provinces',
        // Guovern 维护的全国源，该链接对北方各省地方台覆盖极全
        url: 'https://raw.githubusercontent.com/Guovern/TVConfig/main/w_m.m3u',
        filter: local_filter,
    },
    {
        name: '地方台备用综合源',
        f_name: 'provinces_backup',
        // Joevess 维护的综合源，作为北京、山西、天津等地的有力补充
        url: 'https://raw.githubusercontent.com/joevess/IPTV/main/sources/iptv_sources.m3u',
        filter: local_filter,
    }
];