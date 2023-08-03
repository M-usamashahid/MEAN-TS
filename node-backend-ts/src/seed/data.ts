
export const SeedUsers = [
    {
        firstName: "Super",
        lastName: "Admin",
        email: "superadmin@eztoned.com",
        password: "v2x$hUgVQ#WS6TRp5X",
        role: "superadmin"
    },
    {
        firstName: "CoachHub",
        lastName: "Admin",
        email: "admin@eztoned.com",
        password: "JEDV$nH679eW8#Csrg",
        role: "admin"
    },
    {
        firstName: "Head",
        lastName: "Coach",
        email: "headcoach@eztoned.com",
        password: "7Szb$5gV4H8u2z#dhy",
        role: "headcoach",
        calendly: 'eztoned'
    }
];

export const SeedKanban = [
    {
        title: "Pending",
        default: true,
        order: 0,
        tasks: []
    },
    {
        title: "In Progress",
        default: true,
        order: 1,
        tasks: []
    },
    {
        title: "Completed",
        default: true,
        order: 2,
        tasks: []
    },
    {
        title: "Canceled",
        default: true,
        order: 3,
        tasks: []
    }
]

export const Sequence = [
    { _id: 'task', sequence: 0 },
    { _id: 'client', sequence: 0 }
]

export const Schedule = [
    // EzToned Xtreme
    {
        title: 'EzToned Xtreme',
        type: 'ezToned-xtreme',
        start: {
            hour: 10,
            min: 0,
            timezone: '12' // GMT+12
        },
        end: {
            hour: 11,
            min: 0,
            timezone: '12'
        },
        days: {
            monday: {
                id: '88642999249',
                link: 'https://us06web.zoom.us/j/88642999249'
            },
            tuesday: {
                id: '89224597260',
                link: 'https://us06web.zoom.us/j/89224597260'
            },
            wednesday: {
                id: '81734476273',
                link: 'https://us06web.zoom.us/j/81734476273'
            },
            thursday: {
                id: '81374653100',
                link: 'https://us06web.zoom.us/j/81374653100'
            },
            friday: {
                id: '81893947094',
                link: 'https://us06web.zoom.us/j/81893947094'
            }
        },
    },
    {
        title: 'EzToned Xtreme',
        type: 'ezToned-xtreme',
        start: {
            hour: 14,
            min: 0,
            timezone: '12'
        },
        end: {
            hour: 15,
            min: 0,
            timezone: '12'
        },
        days: {
            monday: {
                id: '85709722817',
                link: 'https://us06web.zoom.us/j/85709722817'
            },
            tuesday: {
                id: '83767056422',
                link: 'https://us06web.zoom.us/j/83767056422'
            },
            wednesday: {
                id: '81909933603',
                link: 'https://us06web.zoom.us/j/81909933603'
            },
            thursday: {
                id: '82366341989',
                link: 'https://us06web.zoom.us/j/82366341989'
            },
            friday: {
                id: '88585126208',
                link: 'https://us06web.zoom.us/j/88585126208'
            }
        },
    },
    // EzToned Range
    {
        title: 'EzToned Rage',
        type: 'ezToned-range',
        start: {
            hour: 12,
            min: 0,
            timezone: '12' // GMT+12
        },
        end: {
            hour: 13,
            min: 0,
            timezone: '12'
        },
        days: {
            monday: {
                id: '81201195704',
                link: 'https://us06web.zoom.us/j/81201195704'
            },
            tuesday: {
                id: '81496439403',
                link: 'https://us06web.zoom.us/j/81496439403'
            },
            wednesday: {
                id: '82371812162',
                link: 'https://us06web.zoom.us/j/82371812162'
            },
            thursday: {
                id: '85805704470',
                link: 'https://us06web.zoom.us/j/85805704470'
            },
            friday: {
                id: '81552089287',
                link: 'https://us06web.zoom.us/j/81552089287'
            }
        },
    },
    {
        title: 'EzToned Rage',
        type: 'ezToned-range',
        start: {
            hour: 16,
            min: 0,
            timezone: '12' // GMT+12
        },
        end: {
            hour: 17,
            min: 0,
            timezone: '12'
        },
        days: {
            monday: {
                id: '84165020079',
                link: 'https://us06web.zoom.us/j/84165020079'
            },
            tuesday: {
                id: '89234269294',
                link: 'https://us06web.zoom.us/j/89234269294'
            },
            wednesday: {
                id: '83095208040',
                link: 'https://us06web.zoom.us/j/83095208040'
            },
            thursday: {
                id: '82081423645',
                link: 'https://us06web.zoom.us/j/82081423645'
            },
            friday: {
                id: '83685933765',
                link: 'https://us06web.zoom.us/j/83685933765'
            }
        },
    },
]