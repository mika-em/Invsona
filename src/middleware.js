const url = require('url');

module.exports = (req, res, next) => {
    res.locals.navLinks = navLinks;
    res.locals.personaLinks = personaLinks;
    res.locals.currentURL = url.parse(req.url).pathname;
    res.locals.dialogueLinks = dialogueLinks;
    res.locals.dialogueFilters = dialogueFilters;
    next();
};

const navLinks = [{
    name: 'Home',
    link: '/',
    icon: './images/invsona.png',
    upperName: 'HOME',
    description: 'Lorem ipsum dolor'
},
{
    name: 'Persona',
    link: '/persona',
    icon: 'border_color',
    upperName: 'PERSONA',
    description: 'Create a character with unique personality traits and a backstory.'
},
{
    name: 'Dialogue',
    link: '/dialogue',
    icon: 'forum',
    upperName: 'DIALOGUE',
    description: 'Create a conversation between two characters.'
},
{
    name: 'Saved',
    link: '/saved',
    icon: 'collections_bookmark',
    upperName: 'SAVED',
    description: 'Save your character prompts, dialogue scripts, and unique prompts.'
},
{
    name: 'Profile',
    link: '/profile',
    icon: 'account_circle',
    upperName: 'PROFILE',
    description: 'Access your profile and account settings.'
},
];

const personaLinks = [{
    name: 'General presets',
    icon: 'fa-solid fa-user-astronaut fa-2xl',
    link: '/persona/general-prompt'
},
{
    name: 'Saved presets',
    icon: 'fa-solid fa-floppy-disk fa-2xl',
    link: '/persona/saved-prompt'
},
{
    name: 'Create a new preset',
    icon: 'fa-solid fa-circle-plus fa-2xl',
    link: '/persona/new-prompt'
},
{
    name: 'Write my own preset',
    icon: 'fa-solid fa-pen-to-square fa-2xl',
    link: '/persona/chat'
},
];

const dialogueLinks = [{
    name: 'Start a new dialogue',
    link: '/dialogueFilters'
},
{
    name: 'Saved dialogues',
    link: '/persona/saved-dialogue'
}
];

const dialogueFilters = [{
    name: 'Inner Dialogue',
    link: '/dialogue/inner-dialogue'
},
{
    name: 'User-Persona Chat',
    link: '/dialogue/user-persona-chat'
}
];


