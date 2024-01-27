import { INavbarData } from "./helper";

const getDataCampus: INavbarData[] = [
    {
        routeLink: 'campus/building',
        label: 'Building',
        items: [
            {
                routeLink: 'campus/building/create',
                label: 'Create'
            },
            {
                routeLink: 'campus/building/edit',
                label: 'Edit'
            },
            {
                routeLink: 'campus/building/list',
                label: 'List'
            }
        ]
    },
    {
        routeLink: 'campus/floor',
        label: 'Floor',
        items: [
            {
                routeLink: 'campus/floor/create',
                label: 'Create'
            },
            {
                routeLink: 'campus/floor/edit',
                label: 'Edit'
            },
            {
                routeLink: 'campus/floor/list',
                label: 'List'
            }
        ]
    },
    {
        routeLink: 'campus/elevator',
        label: 'Elevator',
        items: [
            {
                routeLink: 'campus/elevator/create',
                label: 'Create'
            },
            {
                routeLink: 'campus/elevator/edit',
                label: 'Edit'
            },
            {
                routeLink: 'campus/elevator/list',
                label: 'List by building'
            }
        ]
    },
    {
        routeLink: 'campus/map',
        label: 'Map',
        items: [
            {
                routeLink: 'campus/map/load',
                label: 'Load map'
            }
        ]
    },
    {
        routeLink: 'campus/passageway',
        label: 'Passageway',
        items: [
            {
                routeLink: 'campus/passageway/create',
                label: 'Create'
            },
            {
                routeLink: 'campus/passageway/edit',
                label: 'Edit'
            },
            {
                routeLink: 'campus/passageway/list',
                label: 'List'
            }
        ]
    },
    {
        routeLink: 'campus/room',
        label: 'Room',
        items: [
            {
                routeLink: 'campus/room/create',
                label: 'Create'
            }
        ]
    }
];

const getDataFleet: INavbarData[] = [
    {
        routeLink: 'fleet/deviceType',
        label: 'Type of robot',
        items: [
            {
                routeLink: 'fleet/deviceType/create',
                label: 'Create'
            }
        ]
    },
    {
        routeLink: 'fleet/device',
        label: 'Robot',
        items: [
            {
                routeLink: 'fleet/device/create',
                label: 'Create'
            },
            {
                routeLink: 'fleet/device/inhibit',
                label: 'Inhibit/Disinhibit'
            },
            {
                routeLink: 'fleet/device/list',
                label: 'List'
            }
        ]
    }
];

const getDataTask: INavbarData[] = [
    {
        routeLink: 'task/path',
        label: 'Get route between buildings'
    },
    {
        routeLink: 'task/approve',
        label: 'Approve/Reject task request'
    },
    {
        routeLink: 'task/list',
        label: 'List task request'
    },
    {
        routeLink: 'task/exec',
        label: 'Execute Tasks'
    }
];

const getDataAdministration: INavbarData[] = [
    {
        routeLink: 'administration/mbco',
        label: 'MBCO'
    },
    {
        routeLink: 'administration/strategy',
        label: 'Data recovery strategy'
    }
];

const getDataVisualization: INavbarData[] = [
    {
        routeLink: 'visualization/interactive',
        label: 'Interactive visualization'
    },
    {
        routeLink: 'visualization/animation',
        label: 'Path animation'
    }
];

const getDataUsersAdminstration: INavbarData[] = [
    {
        routeLink: 'user/create',
        label: 'Create'
    },
    {
        routeLink: 'user/activate',
        label: 'Activate'
    }
];

const getDataInfo: INavbarData[] = [
    {
        routeLink: 'info/rgpd',
        label: 'RGPD'
    },
    {
        routeLink: 'info/about',
        label: 'About us'
    }
];

export const navbarDataCampus: INavbarData[] = [
    {
        routeLink: 'home',
        icon: 'fal fa-home',
        label: 'Home'
    },
    {
        routeLink: 'campus',
        icon: 'fal fa-university',
        label: 'Campus',
        items: getDataCampus
    },
    {
        routeLink: 'visualization',
        icon: 'fal fa-cube',
        label: '3D Visualization',
        items: getDataVisualization
    },
    {
        routeLink: 'info',
        icon: 'fal fa-info',
        label: 'Information',
        items: getDataInfo
    },
    {
        routeLink: 'logout',
        icon: 'fal fa-sign-out-alt',
        label: 'Logout'
    }
];

export const navbarDataFleet: INavbarData[] = [
    {
        routeLink: 'home',
        icon: 'fal fa-home',
        label: 'Home'
    },
    {
        routeLink: 'fleet',
        icon: 'fal fa-robot',
        label: 'Fleet',
        items: getDataFleet
    },
    {
        routeLink: 'visualization',
        icon: 'fal fa-cube',
        label: '3D Visualization',
        items: getDataVisualization
    },
    {
        routeLink: 'info',
        icon: 'fal fa-info',
        label: 'Information',
        items: getDataInfo
    },
    {
        routeLink: 'logout',
        icon: 'fal fa-sign-out-alt',
        label: 'Logout'
    }
];

export const navbarDataSystem: INavbarData[] = [
    {
        routeLink: 'home',
        icon: 'fal fa-home',
        label: 'Home'
    },
    {
        routeLink: 'user',
        icon: 'fal fa-user',
        label: 'Users',
        items: getDataUsersAdminstration
    },
    {
        routeLink: 'administration',
        icon: 'fal fa-cogs',
        label: 'Systems Administration',
        items: getDataAdministration
    },
    {
        routeLink: 'info',
        icon: 'fal fa-info',
        label: 'Information',
        items: getDataInfo
    },
    {
        routeLink: 'logout',
        icon: 'fal fa-sign-out-alt',
        label: 'Logout'
    }
];

export const navbarDataTask: INavbarData[] = [
    {
        routeLink: 'home',
        icon: 'fal fa-home',
        label: 'Home'
    },
    {
        routeLink: 'task',
        icon: 'fal fa-check-square',
        label: 'Task planning',
        items: getDataTask
    },
    {
        routeLink: 'visualization',
        icon: 'fal fa-cube',
        label: '3D Visualization',
        items: getDataVisualization
    },
    {
        routeLink: 'info',
        icon: 'fal fa-info',
        label: 'Information',
        items: getDataInfo
    },
    {
        routeLink: 'logout',
        icon: 'fal fa-sign-out-alt',
        label: 'Logout'
    }
];

export const navbarDataUser: INavbarData[] = [
    {
        routeLink: 'home',
        icon: 'fal fa-home',
        label: 'Home'
    },
    {
        routeLink: 'task/create',
        icon: 'fal fa-check-square',
        label: 'Create Task',
        items: [
            {
                routeLink: 'task/create/task-surveillance',
                label: 'Create Surveillance Task'
            },
            {
                routeLink: 'task/create/task-pickup-and-delivery',
                label: 'Create Pickup & Delivery Task'
            }
        ]
    },
    {
        routeLink: 'profile',
        icon: 'fal fa-user',
        label: 'My Profile'
    },
    {
        routeLink: 'info',
        icon: 'fal fa-info',
        label: 'Information',
        items: getDataInfo
    },
    {
        routeLink: 'logout',
        icon: 'fal fa-sign-out-alt',
        label: 'Logout'
    }
];
