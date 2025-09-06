export interface RosaryMystery {
  id: number;
  name: string;
  scripture: string;
  reflection: string;
  meditation: string;
}

export interface RosarySet {
  name: string;
  day: string;
  color: string;
  mysteries: RosaryMystery[];
}

export const rosaryData: RosarySet[] = [
  {
    name: "Joyful Mysteries",
    day: "Monday & Saturday",
    color: "text-yellow-600",
    mysteries: [
      {
        id: 1,
        name: "The Annunciation",
        scripture: "Luke 1:26-38",
        reflection: "Mary's faith and trust in God's plan teaches us to say 'yes' to God's will in our lives.",
        meditation: "How can I be more open to God's calling in my life? What fears or doubts hold me back from trusting completely in His plan?"
      },
      {
        id: 2,
        name: "The Visitation",
        scripture: "Luke 1:39-56",
        reflection: "Mary's visit to Elizabeth shows us the importance of caring for others and sharing our joy.",
        meditation: "When did I last visit someone in need? How can I better serve others with the same love Mary showed Elizabeth?"
      },
      {
        id: 3,
        name: "The Nativity",
        scripture: "Luke 2:1-20",
        reflection: "Jesus' humble birth reminds us that God comes to us in unexpected ways and simple places.",
        meditation: "Where do I encounter Jesus in my daily life? How can I recognize His presence in ordinary moments?"
      },
      {
        id: 4,
        name: "The Presentation",
        scripture: "Luke 2:22-40",
        reflection: "Simeon and Anna's faithful waiting teaches us about patience and recognition of God's promises.",
        meditation: "What am I waiting for in my spiritual life? How can I better prepare myself to recognize God's gifts?"
      },
      {
        id: 5,
        name: "The Finding in the Temple",
        scripture: "Luke 2:41-52",
        reflection: "Jesus teaching in the temple shows us the importance of growing in wisdom and understanding.",
        meditation: "How am I growing in my knowledge and love of God? What steps can I take to deepen my spiritual learning?"
      }
    ]
  },
  {
    name: "Sorrowful Mysteries",
    day: "Tuesday & Friday",
    color: "text-purple-600",
    mysteries: [
      {
        id: 1,
        name: "The Agony in the Garden",
        scripture: "Matthew 26:36-46",
        reflection: "Jesus' prayer in Gethsemane teaches us to turn to God in our darkest moments and trust in His will.",
        meditation: "What burdens am I carrying that I need to surrender to God? How can prayer strengthen me during difficult times?"
      },
      {
        id: 2,
        name: "The Scourging at the Pillar",
        scripture: "Matthew 27:26",
        reflection: "Jesus' silent suffering shows us how to endure pain with dignity and love.",
        meditation: "How do I respond to criticism or unfair treatment? Can I offer my sufferings for the good of others?"
      },
      {
        id: 3,
        name: "The Crowning with Thorns",
        scripture: "Matthew 27:27-31",
        reflection: "The soldiers' mockery of Jesus reminds us that true kingship comes through service and sacrifice.",
        meditation: "When have I been mocked or ridiculed for my faith? How can I respond with love rather than anger?"
      },
      {
        id: 4,
        name: "The Carrying of the Cross",
        scripture: "Matthew 27:32; Luke 23:26-32",
        reflection: "Jesus carrying His cross teaches us to accept our daily struggles with courage and purpose.",
        meditation: "What crosses am I called to carry? How can I unite my sufferings with Christ's passion for redemption?"
      },
      {
        id: 5,
        name: "The Crucifixion",
        scripture: "Matthew 27:33-56",
        reflection: "Jesus' death on the cross is the ultimate act of love and forgiveness for all humanity.",
        meditation: "How deeply do I understand the sacrifice Jesus made for me? What changes in my life reflect this love?"
      }
    ]
  },
  {
    name: "Glorious Mysteries",
    day: "Wednesday & Sunday",
    color: "text-gold-600",
    mysteries: [
      {
        id: 1,
        name: "The Resurrection",
        scripture: "Matthew 28:1-10",
        reflection: "Jesus' resurrection gives us hope for eternal life and victory over sin and death.",
        meditation: "How does the reality of Jesus' resurrection change how I live each day? What sins do I need to let die in my life?"
      },
      {
        id: 2,
        name: "The Ascension",
        scripture: "Luke 24:36-53",
        reflection: "Jesus' ascension reminds us that our true home is in heaven, and He has prepared a place for us.",
        meditation: "How attached am I to earthly things? What can I do to focus more on my eternal destiny?"
      },
      {
        id: 3,
        name: "The Descent of the Holy Spirit",
        scripture: "Acts 2:1-31",
        reflection: "Pentecost shows us the power of the Holy Spirit to transform fear into courage and doubt into faith.",
        meditation: "How is the Holy Spirit working in my life? What gifts has He given me to serve others?"
      },
      {
        id: 4,
        name: "The Assumption of Mary",
        scripture: "Revelation 12:1",
        reflection: "Mary's assumption into heaven shows us the dignity of the human body and our call to holiness.",
        meditation: "How do I care for my body as a temple of the Holy Spirit? What can Mary teach me about living a holy life?"
      },
      {
        id: 5,
        name: "The Coronation of Mary",
        scripture: "Revelation 12:1",
        reflection: "Mary's coronation as Queen of Heaven shows us the reward for faithful discipleship.",
        meditation: "How can Mary intercede for me in my spiritual journey? What does it mean to honor her as my spiritual mother?"
      }
    ]
  },
  {
    name: "Luminous Mysteries",
    day: "Thursday",
    color: "text-blue-600",
    mysteries: [
      {
        id: 1,
        name: "The Baptism of Jesus",
        scripture: "Matthew 3:13-17",
        reflection: "Jesus' baptism marks the beginning of His public ministry and reveals the Trinity.",
        meditation: "How do I live out my baptismal promises? What does it mean to be God's beloved child?"
      },
      {
        id: 2,
        name: "The Wedding Feast at Cana",
        scripture: "John 2:1-11",
        reflection: "Jesus' first miracle shows His care for human joy and His mother's intercession.",
        meditation: "How do I celebrate life's joys in a way that honors God? When do I turn to Mary for help?"
      },
      {
        id: 3,
        name: "The Proclamation of the Kingdom",
        scripture: "Mark 1:14-15",
        reflection: "Jesus' preaching calls us to conversion and belief in the Good News of salvation.",
        meditation: "How am I responding to Jesus' call to repentance? What areas of my life need transformation?"
      },
      {
        id: 4,
        name: "The Transfiguration",
        scripture: "Matthew 17:1-8",
        reflection: "Jesus' transfiguration gives us a glimpse of His divine glory and our future with God.",
        meditation: "When have I experienced God's presence in prayer? How can these moments strengthen my faith during difficult times?"
      },
      {
        id: 5,
        name: "The Institution of the Eucharist",
        scripture: "Matthew 26:26-29",
        reflection: "The Last Supper gives us the gift of Jesus' real presence in the Eucharist.",
        meditation: "How do I prepare for and participate in Mass? What does receiving Jesus in Communion mean to me?"
      }
    ]
  }
];

export const rosaryPrayers = {
  signOfCross: "In the name of the Father, and of the Son, and of the Holy Spirit. Amen.",
  apostlesCreed: "I believe in God, the Father almighty, Creator of heaven and earth, and in Jesus Christ, His only Son, our Lord, who was conceived by the Holy Spirit, born of the Virgin Mary, suffered under Pontius Pilate, was crucified, died and was buried; He descended into hell; on the third day He rose again from the dead; He ascended into heaven, and is seated at the right hand of God the Father almighty; from there He will come to judge the living and the dead. I believe in the Holy Spirit, the holy catholic Church, the communion of saints, the forgiveness of sins, the resurrection of the body, and life everlasting. Amen.",
  ourFather: "Our Father, who art in heaven, hallowed be Thy name; Thy kingdom come, Thy will be done on earth as it is in heaven. Give us this day our daily bread, and forgive us our trespasses, as we forgive those who trespass against us; and lead us not into temptation, but deliver us from evil. Amen.",
  hailMary: "Hail Mary, full of grace, the Lord is with thee. Blessed art thou amongst women, and blessed is the fruit of thy womb, Jesus. Holy Mary, Mother of God, pray for us sinners, now and at the hour of our death. Amen.",
  gloryBe: "Glory be to the Father, and to the Son, and to the Holy Spirit, as it was in the beginning, is now, and ever shall be, world without end. Amen.",
  fatimaPrayer: "O my Jesus, forgive us our sins, save us from the fires of hell, lead all souls to Heaven, especially those most in need of Thy mercy.",
  hailHolyQueen: "Hail, Holy Queen, Mother of mercy, our life, our sweetness, and our hope. To thee do we cry, poor banished children of Eve. To thee do we send up our sighs, mourning and weeping in this valley of tears. Turn then, most gracious advocate, thine eyes of mercy toward us, and after this our exile, show unto us the blessed fruit of thy womb, Jesus. O clement, O loving, O sweet Virgin Mary! Pray for us, O Holy Mother of God, that we may be made worthy of the promises of Christ."
};

export const getDailyMystery = (): RosarySet => {
  const today = new Date().getDay(); // 0 = Sunday, 1 = Monday, etc.
  
  switch (today) {
    case 1: // Monday
    case 6: // Saturday
      return rosaryData[0]; // Joyful
    case 2: // Tuesday
    case 5: // Friday
      return rosaryData[1]; // Sorrowful
    case 0: // Sunday
    case 3: // Wednesday
      return rosaryData[2]; // Glorious
    case 4: // Thursday
      return rosaryData[3]; // Luminous
    default:
      return rosaryData[0]; // Default to Joyful
  }
};