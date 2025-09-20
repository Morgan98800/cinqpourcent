import React, { useState, useEffect, useRef } from 'react';

// The full CSS from the original HTML file, adapted for React
const styles = `
    @keyframes liquid-gradient-animation {
        0% {
            background-position: 0% 50%;
        }
        50% {
            background-position: 100% 50%;
        }
        100% {
            background-position: 0% 50%;
        }
    }
    body {
        font-family: 'Inter', sans-serif;
        background: linear-gradient(-45deg, #1f2a40, #3a4b63, #5a6b82, #3a4b63);
        background-size: 400% 400%;
        animation: liquid-gradient-animation 20s ease infinite;
        color: #e0e7ff;
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 100vh;
    }
    .liquid-glass-card {
        background-color: rgba(64, 80, 100, 0.4);
        backdrop-filter: blur(25px) saturate(180%);
        -webkit-backdrop-filter: blur(25px) saturate(180%);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 2rem;
        box-shadow: 0 4px 24px rgba(0, 0, 0, 0.3);
        position: relative;
        z-index: 10;
    }
    .liquid-glass-card::before {
        content: '';
        position: absolute;
        inset: 0;
        border-radius: 2rem;
        padding: 2px;
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0) 50%, rgba(255, 255, 255, 0.3) 100%);
        -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
        -webkit-mask-composite: xor;
        mask-composite: exclude;
        z-index: -1;
    }
    .card {
        background-color: rgba(64, 80, 100, 0.6);
        backdrop-filter: blur(15px);
        border: 1px solid rgba(255, 255, 255, 0.1);
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        transition: transform 0.5s ease-in-out;
        transform-style: preserve-3d;
    }
    .card.is-flipping {
        transform: rotateY(180deg);
    }
    .button-primary {
        background: linear-gradient(45deg, #6a82fb, #b0c4de);
        color: #ffffff;
        border: none;
        cursor: pointer;
        transition: all 0.3s ease;
        box-shadow: 0 4px 15px rgba(106, 130, 251, 0.3);
    }
    .button-primary:hover {
        box-shadow: 0 6px 20px rgba(106, 130, 251, 0.4);
        transform: translateY(-2px);
    }
    .button-primary:active {
        transform: scale(0.98);
        box-shadow: 0 2px 10px rgba(106, 130, 251, 0.2);
    }
    .button-secondary {
        background-color: rgba(255, 255, 255, 0.1);
        color: #e0e7ff;
        border: 1px solid rgba(255, 255, 255, 0.2);
        cursor: pointer;
        transition: background-color 0.3s;
    }
    .button-secondary:hover {
        background-color: rgba(255, 255, 255, 0.2);
    }
    input[type="number"], input[type="text"] {
        background-color: rgba(43, 58, 85, 0.5);
        border: 1px solid rgba(255, 255, 255, 0.2);
        color: white;
        transition: box-shadow 0.3s;
    }
    input[type="number"]:focus, input[type="text"]:focus {
        outline: none;
        box-shadow: 0 0 0 2px rgba(106, 130, 251, 0.5);
    }
    .category-card {
        cursor: pointer;
        transition: transform 0.2s, box-shadow 0.2s;
        border: 2px solid transparent;
    }
    .category-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
    }
    .category-card.selected {
        border-color: #b0c4de;
        box-shadow: 0 0 0 4px #b0c4de;
        transform: translateY(0);
    }
    .orb {
        position: absolute;
        width: 150px;
        height: 150px;
        background: rgba(189, 212, 251, 0.4);
        border-radius: 50%;
        filter: blur(50px);
        animation: float-orb 15s ease-in-out infinite;
        z-index: -1;
    }
    .orb-1 {
        top: 10%;
        left: 5%;
        width: 180px;
        height: 180px;
        background: rgba(189, 212, 251, 0.5);
        animation-duration: 18s;
    }
    .orb-2 {
        bottom: 20%;
        right: 15%;
        width: 120px;
        height: 120px;
        background: rgba(150, 180, 255, 0.5);
        animation-duration: 16s;
        animation-delay: -2s;
    }
    .orb-3 {
        top: 40%;
        right: 10%;
        width: 200px;
        height: 200px;
        background: rgba(200, 220, 255, 0.5);
        animation-duration: 22s;
        animation-delay: -5s;
    }
    @keyframes float-orb {
        0% {
            transform: translate(0, 0) rotate(0deg);
        }
        25% {
            transform: translate(-10px, -20px) rotate(5deg);
        }
        50% {
            transform: translate(-20px, 0px) rotate(10deg);
        }
        75% {
            transform: translate(-10px, 20px) rotate(5deg);
        }
        100% {
            transform: translate(0, 0) rotate(0deg);
        }
    }
    .icon-btn {
        background: none;
        border: none;
        padding: 8px;
        cursor: pointer;
        transition: transform 0.2s;
    }
    .icon-btn:hover {
        transform: scale(1.1);
    }
`;

function App() {
    const [screen, setScreen] = useState('setup');
    const [numPlayers, setNumPlayers] = useState(2);
    const [players, setPlayers] = useState(Array(2).fill(''));
    const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
    const [questions, setQuestions] = useState([]);
    const [isCardFlipping, setIsCardFlipping] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('deep');
    const [timeLeft, setTimeLeft] = useState(30);
    const [isMuted, setIsMuted] = useState(false);
    const [isGroupQuestion, setIsGroupQuestion] = useState(false);
    const [groupQuestionText, setGroupQuestionText] = useState('');
    const timerRef = useRef(null);
    const questionCardRef = useRef(null);

    // Audio file URL, hosted on a gist
    const cardFlipSound = useRef(new Audio('https://gist.githubusercontent.com/MorganCanteri/c9de6cf8-c6ae-4330-91c4-8caf25d93d72/raw/flipcard.mp3'));

    useEffect(() => {
        if (screen === 'game' && !isGroupQuestion) {
            startTimer();
        } else {
            stopTimer();
        }
        return () => stopTimer();
    }, [screen, isGroupQuestion, players, currentPlayerIndex]);

    const questionSets = {
        deep: [
            "Quelles relations de vie m'ont le plus transformé ?",
            "Faut-il toujours dire la vérité ?",
            "Est-ce que je pardonne facilement, et pourquoi ?",
            "Est-ce que j'agis selon mes propres valeurs ou celles de la société ?",
            "Comment tes priorités ont-elles évolué, durant ces dix dernières années ?",
            "Qu'est-ce que je ferais différemment si je n'avais pas peur du jugement ?",
            "Comment gères-tu tes doutes ?",
            "Quel est le plus grand risque que j'ai déjà pris ?",
            "Quel est ton plus grand accomplissement, jusqu'ici ?",
            "Est-ce que je contrôle mon destin ou suis-je porté par les circonstances ?",
            "Quel effort, petit ou grand, essaies-tu de faire chaque jour pour t'approcher de la personne que tu souhaites devenir ?",
            "T'est-il arrivé de faire des cauchemars récurrents ?",
            "Qu'est-ce que je cache le plus aux autres ?",
            "Quels objectifs t'es-tu fixés récemment ? Penses-tu être sur la bonne voie pour les atteindre ?",
            "Est-ce que j'accepte vraiment mes faiblesses ou est-ce que je les cache ?",
            "La jalousie est-elle saine selon toi ?",
            "Quelle évolution souhaiterais-tu avoir au travail ?",
            "Quelle est la chose que j'ai le plus peur de le regretter plus tard ?",
            "Est-ce que j'ai peur de l'échec ?",
            "Est-ce qu'on peut aimer sans conditions ?",
            "Si toi du passé te regardes actuellement, penses-tu qu'elle serait fière de tout ce que tu as accompli ?",
            "Est-ce que je vis selon ce que je veux ou selon ce qu'on attend de moi ?",
            "Quels rêves d'enfance ai-je laissés de côté, et pourquoi ?",
            "Qu'est-ce qui te passionne le plus dans la vie ?",
            "Quelle est la leçon la plus difficile que tu aies apprise ?",
            "Quel est le conseil que tu donnerais à ton moi plus jeune ?",
            "Quelle est ta plus grande source d'inspiration ?",
            "Comment définirais-tu le bonheur ?",
            "Quelle est la chose qui te rend le plus vulnérable ?",
            "Quand est-ce que tu t'es senti le plus fier de toi ?",
            "Y a-t-il un moment de ta vie que tu changerais si tu le pouvais ?",
            "Quelle est la qualité que tu admires le plus chez les autres ?",
            "Comment gères-tu les critiques ?",
            "Qu'est-ce que la fidélité pour toi ?",
            "Quel est ton plus grand regret ?",
            "Comment décrirais-tu la personne que tu es aujourd'hui, en trois mots ?",
            "Y a-t-il un livre, un film ou une chanson qui a changé ta perspective sur la vie ?",
            "Comment est-ce que tu aimerais qu'on se souvienne de toi ?",
            "Quelle est la chose la plus importante que tu as apprise sur l'amour ?",
            "Qu'est-ce qui est le plus important pour toi : être aimé ou aimer ?",
            "Quelle est la chose la plus difficile que tu aies eu à pardonner ?",
            "Comment gères-tu la solitude ?",
            "Si tu pouvais avoir une conversation avec n'importe qui, vivant ou mort, qui choisirais-tu ?",
            "Quelle est la chose la plus importante que l'on t'ait apprise ?",
            "Qu'est-ce qui te fait te sentir vivant(e) ?",
            "Quel est l'idéal que tu t'es fixé dans la vie ?",
            "À quoi ressemble ta vie parfaite dans 5 ans ?",
            "Quel est le plus grand obstacle que tu aies surmonté ?",
            "Qu'est-ce qui te fait vraiment peur, et pourquoi ?",
            "Comment prends-tu tes grandes décisions ?",
            "Quelle est la plus grande différence entre la personne que tu es et la personne que les gens pensent que tu es ?",
            "Quelle est une croyance que tu avais et qui a changé avec le temps ?",
            "Quel est le rôle de l'argent dans ta vie ?",
            "À quoi ressemblerait le monde idéal pour toi ?",
            "Quelle est la chose que tu souhaites le plus dans le monde ?",
            "Qu'est-ce qui te motive à te lever le matin ?",
            "Quelle est la qualité que tu apprécies le plus chez un ami ?",
            "Y a-t-il quelque chose que tu aurais aimé savoir avant de grandir ?",
            "Quelle est la chose la plus folle que tu aies faite pour un ami ?",
            "Si tu pouvais changer une seule chose chez toi, ce serait quoi ?",
            "Qu'est-ce qui te manque le plus de ton enfance ?",
            "Quelle est la relation la plus compliquée que tu aies eue ?",
            "Qu'est-ce qui te pousse à donner le meilleur de toi-même ?",
            "Y a-t-il un moment où tu t'es senti désespéré ? Comment as-tu fait face à cela ?",
            "Quel est le plus grand défi que tu aies affronté, et comment l'as-tu surmonté ?",
            "Quelle est la chose la plus importante que tu as apprise de tes échecs ?",
            "Quelle est la chose que tu ferais si tu savais que tu ne peux pas échouer ?",
            "Quel est ton rôle dans ta famille ?",
            "Qu'est-ce que tu ferais si tu avais une journée de plus à vivre ?",
            "Quelle est la personne qui a eu le plus d'influence sur ta vie ?",
            "Quelle est la chose qui te rend le plus fier d'être toi ?",
            "Quand as-tu le plus besoin d'être seul(e) ?",
            "Y a-t-il quelque chose que tu aimerais que l'on comprenne mieux sur toi ?",
            "Quelle est la chose la plus spontanée que tu aies faite ?",
            "Quel est le rêve le plus fou que tu aies ?",
            "Qu'est-ce que tu penses de la vulnérabilité ?",
            "Quelle est la chose que tu as toujours voulue faire, mais dont tu n'as jamais eu le courage ?",
            "Quelle est la plus grande leçon que tu as apprise de ton travail ?",
            "Quelle est une chose qui te fait peur, mais que tu veux absolument essayer ?",
            "Quelle est la plus grande bénédiction de ta vie ?",
            "Quel est le plus grand sacrifice que tu aies fait pour quelqu'un d'autre ?",
            "Qu'est-ce que tu penses du destin ?",
            "Si tu pouvais avoir une conversation avec toi-même plus jeune, que dirais-tu ?",
            "Quelle est la chose que you ne changerais pour rien du monde ?",
            "Qu'est-ce que tu penses de la vieillesse ?",
            "Quelle est la chose que tu as le plus de mal à accepter chez toi ?",
            "Qu'est-ce qui te fait le plus de peine ?",
            "Quelle est la chose la plus importante que tu as apprise sur l'amitié ?",
            "Qu'est-ce que tu fais pour te détendre et te ressourcer ?",
            "Y a-t-il un secret que tu as gardé de tes parents ?",
            "Comment décrirais-tu le plus grand amour de ta vie ?",
            "Quelle est la chose que tu souhaites le plus pour tes amis ?",
            "Quel est ton plus grand défi en ce moment ?",
            "Si tu pouvais revenir en arrière, que ferais-tu différemment ?",
            "Quel est le plus grand mythe sur la vie adulte que tu as découvert ?",
            "Quelle est ta plus grande force, selon toi ?",
            "Quel est ton point faible le plus inattendu ?",
            "Qu'est-ce que tu penses de l'au-delà ?",
            "Quel est ton souvenir le plus précieux ?",
            "Quelle est la chose la plus folle que tu aies faite pour l'amour ?",
            "Si tu pouvais changer le monde, par où commencerais-tu ?",
            "Quel est ton plus grand rêve inavoué ?",
            "Quelle est la plus grande folie que tu aies faite pour un ami ?",
            "Quel est le plus grand regret que tu aies ?",
            "Qu'est-ce que tu souhaites pour ton futur ?",
            "Quel est ton plus grand secret ?",
            "Qu'est-ce qui te rend le plus heureux ?",
        ],
        beer: [
            "Si tu pouvais être un animal, lequel serais-tu et pourquoi ?",
            "Quelle est la chose la plus embarrassante qui te soit arrivée ?",
            "Quelle est ta pire manie ?",
            "Quel film as-tu honte d'aimer ?",
            "Si tu gagnais au loto, quelle est la première chose folle que tu ferais ?",
            "Quel est le meilleur concert auquel tu as assisté ?",
            "Quelle est la meilleure blague que tu connaisses ?",
            "Si tu pouvais avoir un super-pouvoir, lequel choisirais-tu ?",
            "Quelle est la nourriture que tu pourrais manger tous les jours sans t'en lasser ?",
            "Quel est le plus grand 'fail' que you aies connu en cuisine ?",
            "Quel est ton pire talent caché ?",
            "Quelle est la chose la plus ridicule que tu aies achetée ?",
            "Si tu pouvais dîner avec n'importe qui, mort ou vivant, qui choisirais-tu ?",
            "Quel est le nom le plus étrange que tu aies donné à un animal de compagnie ?",
            "Quelle est la chanson que tu chantes le plus souvent sous la douche ?",
            "Quel est le pire cadeau que tu aies reçu ?",
            "Quel est ton plat de confort préféré ?",
            "Quel est le dernier truc que tu as googlé ?",
            "Si tu pouvais vivre dans n'importe quel film, lequel choisirais-tu ?",
            "Quelle est ta série Netflix préférée du moment ?",
            "Quel est ton meme préféré ?",
            "Quelle est la chose que tout le monde aime, mais que tu détestes ?",
            "Quel a été le déguisement le plus drôle que tu aies porté ?",
            "Quelle est la chose la plus inutile que tu aies apprise à l'école ?",
            "Quel est le métier le plus drôle que tu aurais pu faire ?",
            "Si tu devais manger la même chose toute ta vie, ce serait quoi ?",
            "Quel est le plus grand mensonge que tu aies raconté à tes parents ?",
            "Quelle est la célébrité que tu suis et qui te rend un peu honteux ?",
            "Quel est le film que tu as le plus regardé dans ta vie ?",
            "Si tu pouvais être une star de la musique, ce serait qui ?",
            "Quelle est la chose la plus étrange que tu aies trouvée en cherchant sur internet ?",
            "Quel est le plat que tu cuisines le mieux ?",
            "Si tu devais choisir un personnage de dessin animé pour être ton meilleur ami, qui choisirais-tu ?",
            "Quelle est la chose la plus bizarre que tu aies mangée ?",
            "Quel est ton jeu vidéo préféré de tous les temps ?",
            "Si tu pouvais avoir un animal sauvage comme animal de compagnie, lequel choisirais-tu ?",
            "Quelle est la meilleure excuse que tu aies trouvée pour ne pas aller à une soirée ?",
            "Quel est ton plus grand rêve, même s'il est un peu fou ?",
            "Si tu pouvais avoir un seul objet pour le reste de ta vie, ce serait quoi ?",
            "Quelle est la chose la plus drôle que tu aies vue ou entendue récemment ?",
            "Quel est le dernier livre que tu as lu qui t'a fait rire aux éclats ?",
            "Quelle est la meilleure chose à faire pour se vider la tête ?",
            "Quel est ton plus grand talent de danse ?",
            "Quel est le mot le plus bizarre que tu aies utilisé dans une conversation ?",
            "Si tu pouvais être n'importe qui pour une journée, qui serais-tu ?",
            "Quel est le meilleur voyage que tu aies fait ?",
            "Quelle est la chose la plus spontanée que tu aies faite ?",
            "Quel est le meilleur conseil que tu aies reçu ?",
            "Quelle est la chose la plus stupide que tu aies faite pour un pari ?",
            "Quel est ton 'guilty pleasure' en matière de musique ?",
            "Quelle est ta tradition de vacances préférée ?",
            "Quel est le plus grand exploit sportif que tu aies accompli ?",
            "Quelle est la chose la plus bizarre que tu aies vue dans la rue ?",
            "Quel est le plus gros mensonge que tu aies dit à un(e) inconnu(e) ?",
            "Quelle est la chose la plus folle que tu aies vue à la télévision ?",
            "Quel est le pire film que you aies vu ?",
            "Quelle est la chose la plus drôle que tu aies faite avec un ami ?",
            "Quel est ton moment le plus gênant en public ?",
            "Quel est ton plat le plus étrange ?",
            "Quel est le plus grand secret que tu aies partagé avec un ami ?",
            "Quelle est la chose que tu préfères faire pour te détendre ?",
            "Quelle est ta blague préférée ?",
            "Quel est le pire cadeau que tu aies reçu ?",
            "Quel est ton métier de rêve d'enfance ?",
            "Quel est le plus grand 'fail' que you aies connu en cuisine ?",
            "Quel est ton plus grand talent de chant ?",
            "Quel est le film que tu as honte de regarder ?",
            "Quel est le plus grand mensonge que tu aies raconté à tes parents ?",
            "Quelle est la plus grande folie que tu aies faite pour un ami ?",
            "Quel est ton plat de confort préféré ?",
            "Quelle est la chose la plus bizarre que tu aies faite pour de l'argent ?",
            "Quel est ton plus grand rêve, même s'il est un peu fou ?",
            "Quelle est la chose la plus drôle que you aies vue sur internet ?",
            "Quel est le plus grand 'faux pas' que you aies fait en public ?",
            "Quel est ton plus grand 'guilty pleasure' en matière de musique ?",
            "Quelle est la chose la plus bizarre que tu aies mangée ?",
            "Quel est le pire cadeau que tu aies reçu ?",
            "Quel est ton métier de rêve d'enfance ?",
            "Quel est le plus grand 'fail' que you aies connu en cuisine ?",
            "Quel est ton plus grand talent de chant ?",
            "Quel est le film que tu as honte de regarder ?",
        ],
        spicy: [
            "Quelle est la chose la plus folle que tu aies faite pour plaire à quelqu'un ?",
            "As-tu déjà espionné le téléphone de ton partenaire ?",
            "Quelle est ta plus grande 'red flag' chez un crush ?",
            "Quel est le compliment le plus bizarre que tu aies reçu ?",
            "Si tu devais choisir une seule personne ici avec qui être bloqué sur une île déserte, qui choisirais-tu et pourquoi ?",
            "Quel est le plus gros mensonge que tu aies dit pour éviter un rendez-vous ?",
            "Quel a été le meilleur (ou pire) 'ghosting' que tu as vécu ?",
            "Si tu devais te faire tatouer le prénom de quelqu'un, ce serait qui ?",
            "Quelle est la chose la plus coquine que tu aies faite en public ?",
            "Quel est ton 'deal-breaker' absolu en amour ?",
            "As-tu déjà fait une 'catfish' ou as-tu été victime d'une 'catfish' ?",
            "Quelle est la chose la plus folle que tu aies faite sous l'influence de l'alcool ?",
            "Quel est le plus gros secret que tu gardes ?",
            "As-tu déjà menti sur ton âge ?",
            "As-tu déjà été infidèle ?",
            "Quelle est la chose la plus bizarre qui te rend attirant(e) ?",
            "À quand remonte ton dernier baiser ?",
            "Quel est ton fantasme le plus osé ?",
            "Quelle est la chose la plus romantique que tu aies faite pour quelqu'un ?",
            "Quel est le sujet le plus tabou dont tu puisses parler avec moi ?",
            "Quelle est la chose la plus folle que tu aies faite en voiture ?",
            "As-tu déjà eu une aventure d'un soir ?",
            "Quelle est ta 'green flag' préférée chez quelqu'un ?",
            "Quelle est la chose la plus secrète que tu as partagée avec quelqu'un ?",
            "Quel est le plus grand mensonge que you aies dit à un crush ?",
            "Quelle est la chose la plus embarrassante qui te soit arrivée au lit ?",
            "Quel est ton type de personnalité, physiquement et mentalement ?",
            "As-tu déjà eu le cœur brisé ? Raconte.",
            "Quelle est la chose la plus étrange que tu aies trouvée dans les affaires de quelqu'un ?",
            "Quelle est ta plus grande insécurité physique ?",
            "As-tu déjà été en couple avec un(e) ex d'un(e) ami(e) ?",
            "Quelle est la chose la plus folle que you aies faite pour te venger de quelqu'un ?",
            "As-tu déjà eu un crush sur un(e) ami(e) ? Est-ce que tu l'as avoué ?",
            "Quel est le plus grand 'faux pas' que you aies fait en public ?",
            "Quelle est la chose la plus folle que you aies faite pour passer le temps ?",
            "Quel est le secret que tu n'as jamais dit à personne ?",
            "Quel est le plus grand risque que you aies pris pour une personne ?",
            "Quelle est la chose la plus étrange que you aies faite en rendez-vous ?",
            "Est-ce que tu as déjà eu un coup de foudre ?",
            "Quel est le plus grand tabou que you aies brisé ?",
            "Quelle est la plus grande honte que you aies eue ?",
            "Quelle est la chose la plus secrète que you aies faite dans un endroit public ?",
            "Quel est le plus grand fantasme que you aies, mais que you n'as jamais réalisé ?",
            "Quelle est la chose que you regrettes le plus d'avoir dite à quelqu'un ?",
            "Quelle est la chose la plus bizarre qui te soit arrivée au lit ?",
            "Si tu pouvais effacer une seule erreur de ta vie, ce serait laquelle ?",
            "As-tu déjà volé quelque chose ?",
            "As-tu déjà été arrêté ?",
            "Quelle est la chose la plus folle que you aies faite pour de l'argent ?",
            "Quel est le secret le plus grand que you as partagé avec une personne, mais qui n'est pas ton ami ?",
            "Quelle est la chose la plus folle que you aies faite pour te rapprocher de quelqu'un ?",
            "Quelle est la chose la plus secrète que you aies faite pour quelqu'un ?",
            "Quel est le plus grand secret que you aies jamais gardé ?",
            "Si tu pouvais te venger de quelqu'un, ce serait qui ?",
            "Quel est ton plus grand mensonge ?",
            "Quelle est la chose la plus bizarre que tu aies mangée ?",
            "Quelle est la pire chose que you aies entendue ou vue sur quelqu'un ?",
            "As-tu déjà eu un rendez-vous avec une personne que tu auras rencontrée en ligne ?",
            "Quelle est la chose la plus drôle qui te soit arrivée au travail ?",
            "Quel est le plus grand secret que tu as gardé de ton meilleur ami ?",
        ],
        group: [
            "Quelle est la chose la plus étrange que vous ayez tous en commun ?",
            "Si vous pouviez voyager n'importe où ensemble, où iriez-vous ?",
            "Quelle est la meilleure chose à propos de ce groupe d'amis ?",
            "Décrivez-vous en un mot.",
            "Quel est le souvenir le plus drôle que vous avez tous ensemble ?",
        ]
    };

    const startTimer = () => {
        stopTimer();
        setTimeLeft(30);
        timerRef.current = setInterval(() => {
            setTimeLeft(prevTime => {
                if (prevTime <= 1) {
                    stopTimer();
                    handleEndOfTurn();
                    return 30;
                }
                return prevTime - 1;
            });
        }, 1000);
    };

    const stopTimer = () => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
        }
    };

    const showMessage = (message) => {
        const modal = document.getElementById('message-modal');
        document.getElementById('modal-text').textContent = message;
        modal.classList.remove('hidden');
    };

    const closeModal = () => {
        document.getElementById('message-modal').classList.add('hidden');
    };

    const handleEndOfTurn = () => {
        showMessage("Temps écoulé ! Au joueur suivant.");
        setCurrentPlayerIndex(prevIndex => (prevIndex + 1) % players.length);
        if(questionCardRef.current) {
            questionCardRef.current.textContent = "Cliquez pour tirer une question !";
        }
    };

    const handleStartGame = () => {
        const playerNames = players.map(name => name.trim()).filter(name => name !== '');
        if (playerNames.length < 2) {
            showMessage("Le jeu nécessite au moins 2 joueurs. Veuillez entrer les prénoms de tous les joueurs.");
            return;
        }
        setPlayers(playerNames);
        shuffleQuestions();
        setScreen('game');
        setCurrentPlayerIndex(0);
        // Reset the question card content on new game start
        if(questionCardRef.current) {
            questionCardRef.current.textContent = "Cliquez pour tirer une question !";
        }
    };

    const handleCardFlip = () => {
        if (isCardFlipping) return;
        setIsCardFlipping(true);
        if (!isMuted) {
            cardFlipSound.current.play().catch(e => console.error("Error playing sound:", e));
        }
        stopTimer();

        setTimeout(() => {
            if (questions.length === 0) {
                showMessage("Toutes les questions ont été posées ! La partie est terminée.");
                setIsCardFlipping(false);
                return;
            }

            const nextQuestions = [...questions];
            const nextQuestion = nextQuestions.pop();
            setQuestions(nextQuestions);

            if (questionSets.group.includes(nextQuestion)) {
                setGroupQuestionText(nextQuestion);
                setIsGroupQuestion(true);
            } else {
                if(questionCardRef.current) {
                    questionCardRef.current.textContent = nextQuestion;
                }
                setIsGroupQuestion(false);
                startTimer();
            }

            setIsCardFlipping(false);
            setCurrentPlayerIndex(prevIndex => (prevIndex + 1) % players.length);
        }, 500);
    };

    const handleNextGroupQuestion = () => {
        // Here you would gather and display answers if needed
        setIsGroupQuestion(false);
        setScreen('game');
    };

    const generateInteractiveQuestion = () => {
        if (players.length < 2) return null;
        const player1 = players[Math.floor(Math.random() * players.length)];
        let player2 = player1;
        while (player2 === player1) {
            player2 = players[Math.floor(Math.random() * players.length)];
        }
        const interactiveQuestions = [
            `Qu'est-ce que tu admires le plus chez ${player2} ?`,
            `Si tu devais donner un conseil à ${player2}, quel serait-il ?`,
            `Quelle est la meilleure qualité de ${player2} selon toi ?`,
            `Quelle est la chose la plus drôle que tu aies faite avec ${player2} ?`,
            `Si ${player1} et ${player2} devaient échanger leurs vies pour une journée, que se passerait-il ?`,
            `Qu'est-ce que ${player1} et ${player2} ont en commun ?`,
        ];
        return interactiveQuestions[Math.floor(Math.random() * interactiveQuestions.length)];
    };

    const shuffleQuestions = () => {
        const selectedSet = [...questionSets[selectedCategory]];
        const newQuestions = [...selectedSet];

        if (players.length >= 2) {
            const numInteractive = Math.floor(newQuestions.length * 0.2);
            for (let i = 0; i < numInteractive; i++) {
                newQuestions.push(generateInteractiveQuestion());
            }
        }

        const numGroup = Math.floor(newQuestions.length * 0.1);
        for (let i = 0; i < numGroup; i++) {
            const groupQuestion = questionSets.group[Math.floor(Math.random() * questionSets.group.length)];
            newQuestions.splice(Math.floor(Math.random() * newQuestions.length), 0, groupQuestion);
        }
        setQuestions(newQuestions.sort(() => Math.random() - 0.5));
    };

    const handleNumPlayersChange = (e) => {
        const value = parseInt(e.target.value);
        if (value >= 2) {
            setNumPlayers(value);
            setPlayers(Array(value).fill(''));
        }
    };

    const handlePlayerNameChange = (index, e) => {
        const newPlayers = [...players];
        newPlayers[index] = e.target.value;
        setPlayers(newPlayers);
    };

    return (
        <div className="p-6">
            <style>{styles}</style>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap" rel="stylesheet" />
            <script src="https://cdn.tailwindcss.com"></script>

            <div className="orb orb-1"></div>
            <div className="orb orb-2"></div>
            <div className="orb orb-3"></div>

            {screen === 'setup' && (
                <div id="setup-screen" className="min-h-screen flex items-center justify-center p-4">
                    <div className="w-full max-w-lg p-8 rounded-2xl shadow-2xl space-y-6 md:p-12 liquid-glass-card">
                        <div className="flex flex-col items-center space-y-4">
                            {/* Game Icon */}
                            <svg className="h-16 w-16 text-[#b0c4de]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5A5.4 5.4 0 0 1 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3A5.4 5.4 0 0 1 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                            </svg>
                            <h1 className="text-4xl font-bold text-center text-[#b0c4de]">Cinq %</h1>
                            <p className="text-center text-gray-200 font-light text-lg">Le jeu de questions pour mieux se connaître.</p>
                        </div>

                        {/* Category Selection */}
                        <div>
                            <label className="block text-sm font-medium text-gray-200">Choix des questions:</label>
                            <div className="mt-2 flex flex-wrap justify-center gap-4">
                                <div
                                    className={`category-card flex flex-col items-center p-4 rounded-lg bg-gray-700 ${selectedCategory === 'deep' ? 'selected' : ''}`}
                                    onClick={() => setSelectedCategory('deep')}
                                >
                                    <img src="https://placehold.co/80x64/2b3a55/e0e7ff?text=Deep" alt="Icône pour la catégorie Profond" className="h-20 w-16" />
                                    <span className="mt-2 text-sm text-gray-200">Profond</span>
                                </div>
                                <div
                                    className={`category-card flex flex-col items-center p-4 rounded-lg bg-gray-700 ${selectedCategory === 'beer' ? 'selected' : ''}`}
                                    onClick={() => setSelectedCategory('beer')}
                                >
                                    <img src="https://placehold.co/80x64/2b3a55/e0e7ff?text=Beer" alt="Icône pour la catégorie Bières et potes" className="h-20 w-16" />
                                    <span className="mt-2 text-sm text-gray-200">Bières et potes</span>
                                </div>
                                <div
                                    className={`category-card flex flex-col items-center p-4 rounded-lg bg-gray-700 ${selectedCategory === 'spicy' ? 'selected' : ''}`}
                                    onClick={() => setSelectedCategory('spicy')}
                                >
                                    <img src="https://placehold.co/80x64/2b3a55/e0e7ff?text=Spicy" alt="Icône pour la catégorie Spicy" className="h-20 w-16" />
                                    <span className="mt-2 text-sm text-gray-200">Spicy</span>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="num-players" className="block text-sm font-medium text-gray-200">Nombre de joueurs:</label>
                            <input
                                type="number"
                                id="num-players"
                                value={numPlayers}
                                min="2"
                                onChange={handleNumPlayersChange}
                                className="mt-1 block w-full rounded-md p-2.5 shadow-sm focus:ring-[#6a82fb] focus:border-[#6a82fb]"
                            />
                        </div>

                        <div id="players-container" className="space-y-4">
                            {Array.from({ length: numPlayers }).map((_, index) => (
                                <div key={index} className="relative mt-2">
                                    <label htmlFor={`player-${index}`} className="block text-sm font-medium text-gray-200">Prénom du joueur {index + 1}:</label>
                                    <input
                                        type="text"
                                        id={`player-${index}`}
                                        placeholder="Prénom"
                                        value={players[index] || ''}
                                        onChange={(e) => handlePlayerNameChange(index, e)}
                                        className="mt-1 block w-full rounded-md p-2.5 shadow-sm focus:ring-[#6a82fb] focus:border-[#6a82fb]"
                                    />
                                </div>
                            ))}
                        </div>

                        <button onClick={handleStartGame} className="w-full button-primary py-3 px-4 rounded-full font-bold text-lg shadow-lg">Commencer</button>
                    </div>
                </div>
            )}

            {screen === 'game' && !isGroupQuestion && (
                <div id="game-screen" className="min-h-screen flex flex-col items-center justify-center text-center p-6 space-y-6">
                    <div className="w-full max-w-lg p-8 rounded-2xl shadow-2xl space-y-6 md:p-12 liquid-glass-card">
                        <div className="flex justify-between items-center mb-4">
                            <button onClick={() => { stopTimer(); setScreen('setup'); }} className="button-secondary py-2 px-4 rounded-full font-bold">Retour au menu</button>
                            <button onClick={() => setIsMuted(!isMuted)} className="icon-btn text-gray-200">
                                {isMuted ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .9-.2 1.76-.54 2.54l1.58 1.59C21.2 14.28 22 13.2 22 12c0-4.07-3.06-7.44-7-7.93v2.02c2.89.86 5 3.54 5 6.91zM4.2 3L3 4.2l.28.28L7 8.28V16h3l4 4v-4.18l.78.78 1.25 1.25L17 19.82V12c0-.9-.2-1.76-.54-2.54l1.58-1.59C21.2 9.72 22 10.8 22 12c0 1.42-.4 2.75-1.07 3.93l1.58 1.58C23.33 16.54 24 14.37 24 12c0-5.01-3.69-9.15-8.5-9.87v2.06c2.89.81 5 3.54 5 6.71s-2.11 5.9-5 6.71v2.06c4.01-.91 7-4.47 7-8.77s-2.99-7.86-7-8.77zM14 3.23v2.06c2.89.81 5 3.54 5 6.71s-2.11 5.9-5 6.71v2.06c4.01-.91 7-4.47 7-8.77s-2.99-7.86-7-8.77zM4.2 3L3 4.2l.28.28L7 8.28V16h3l4 4v-4.18l.78.78 1.25 1.25L17 19.82V12c0-.9-.2-1.76-.54-2.54l1.58-1.59C21.2 9.72 22 10.8 22 12c0 1.42-.4 2.75-1.07 3.93l1.58 1.58C23.33 16.54 24 14.37 24 12c0-5.01-3.69-9.15-8.5-9.87v2.06c2.89.81 5 3.54 5 6.71s-2.11 5.9-5 6.71v2.06c4.01-.91 7-4.47 7-8.77s-2.99-7.86-7-8.77z" /></svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.81 5 3.54 5 6.71s-2.11 5.9-5 6.71v2.06c4.01-.91 7-4.47 7-8.77s-2.99-7.86-7-8.77z" /></svg>
                                )}
                            </button>
                        </div>
                        <h2 className="text-2xl font-bold text-[#b0c4de]">C'est au tour de <span id="current-player-name">{players[currentPlayerIndex]}</span></h2>
                        <div id="timer-display" className="text-4xl font-extrabold text-[#b0c4de]">{timeLeft}</div>
                        <div
                            id="question-card"
                            className={`card rounded-2xl p-8 min-h-[200px] flex items-center justify-center text-center text-xl font-bold cursor-pointer ${isCardFlipping ? 'is-flipping' : ''}`}
                            onClick={handleCardFlip}
                        >
                            <p ref={questionCardRef} id="question-text">Cliquez pour tirer une question !</p>
                        </div>
                        <p className="text-gray-400 text-sm">Cliquez sur la carte pour passer à la question suivante.</p>
                    </div>
                </div>
            )}

            {screen === 'game' && isGroupQuestion && (
                <div id="group-question-screen" className="min-h-screen flex flex-col items-center justify-center text-center p-6 space-y-6">
                    <div className="w-full max-w-lg p-8 rounded-2xl shadow-2xl space-y-6 md:p-12 liquid-glass-card">
                        <div className="flex justify-between items-center mb-4">
                            <button onClick={() => setScreen('setup')} className="button-secondary py-2 px-4 rounded-full font-bold">Retour au menu</button>
                        </div>
                        <h2 className="text-2xl font-bold text-[#b0c4de]">Question de groupe !</h2>
                        <div id="group-question-card" className="card rounded-2xl p-8 min-h-[200px] flex items-center justify-center text-center text-xl font-bold">
                            <p id="group-question-text">{groupQuestionText}</p>
                        </div>
                        <div id="group-answers-container" className="space-y-4">
                            {players.map((player, index) => (
                                <div key={index} className="relative mt-2">
                                    <label htmlFor={`answer-${index}`} className="block text-sm font-medium text-gray-200">{player}'s answer:</label>
                                    <textarea
                                        id={`answer-${index}`}
                                        rows="2"
                                        className="mt-1 block w-full rounded-md p-2.5 shadow-sm focus:ring-[#6a82fb] focus:border-[#6a82fb] bg-gray-600 text-white"
                                    ></textarea>
                                </div>
                            ))}
                        </div>
                        <button onClick={handleNextGroupQuestion} className="w-full button-primary py-3 px-4 rounded-full font-bold text-lg shadow-lg">Question suivante</button>
                    </div>
                </div>
            )}

            <div id="message-modal" className="hidden fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4">
                <div className="bg-gray-800 text-white p-6 rounded-lg shadow-xl text-center">
                    <p id="modal-text" className="mb-4 text-lg font-semibold"></p>
                    <button onClick={closeModal} className="button-primary px-6 py-2 rounded-full font-bold">OK</button>
                </div>
            </div>
        </div>
    );
}

export default App;
