import { View, Image, FlatList } from 'react-native';
import CustomText from '../textComponent/CustomText';
import {
  stylesProfileStatusBox,
  stylesRenderMedalCard,
  stylesMedalBox,
  stylesCarousel,
} from './styles';

const icon = require('../../../assets/images/medalIcon.png');
const trophies = require('../../../assets/images/trophies.png');
const medal = require('../../../assets/images/medal.png');

interface ProfileStatusBoxProps {
  user: any;
}

function ProfileStatusBox({user}: ProfileStatusBoxProps) {
  // Calcular a porcentagem de progresso (0-100)
  const xpRequired = 1000;
  const progress = Math.min((user.xp / xpRequired) * 100, 100);

  return (
    <View style={stylesProfileStatusBox.container}>
      <View style={stylesProfileStatusBox.iconContainer}>
        <Image source={icon} style={stylesProfileStatusBox.icon} />
      </View>
      <View style={stylesProfileStatusBox.row}>
        <View style={stylesProfileStatusBox.levelContainer}>
          <CustomText style={stylesProfileStatusBox.textLevel}>
            Seu nível é
          </CustomText>
          <CustomText style={stylesProfileStatusBox.numberLevel}>
            {user.level}
          </CustomText>
        </View>
        <Image source={trophies} style={stylesProfileStatusBox.trophies} />
      </View>
      <View>
        <View style={stylesProfileStatusBox.levelBarContainer}>
          <CustomText style={stylesProfileStatusBox.levelBarText}>
            Pontos para o próximo nível
          </CustomText>
          <CustomText style={stylesProfileStatusBox.ptsText}>
            {user.xp}/{xpRequired}
            <CustomText>pts</CustomText>
          </CustomText>
        </View>
        <View style={stylesProfileStatusBox.bar}>
          <View
            style={[stylesProfileStatusBox.barStatus, {width: `${progress}%`}]}
          />
        </View>
      </View>
    </View>
  );
}

interface MedalBoxProps {
  user: any;
}

function renderMedalCard(ac: any) {
  return (
    <View style={stylesRenderMedalCard.renderMedalCardContainer}>
      <View style={stylesRenderMedalCard.medalIconContainer}>
        <Image source={medal} style={stylesRenderMedalCard.medalIcon} />
      </View>
      <View>
        <CustomText style={stylesRenderMedalCard.medalCriterionText}>
          {ac.criterion}
        </CustomText>
      </View>
    </View>
  );
}

const EmptyMedalList = () => (
  <View style={stylesMedalBox.textMedalBoxContainer}>
    <CustomText style={stylesMedalBox.textMedalBox}>
      Você ainda não possui medalhas
    </CustomText>
  </View>
);

function MedalBox({user}: MedalBoxProps) {
  const groupedAchievements: any[][] = [];

  if (user.achievements) {
    for (let i = 0; i < user.achievements.length; i += 2) {
      groupedAchievements.push(user.achievements.slice(i, i + 2));
    }
  }

  return (
    <View style={stylesMedalBox.container}>
      <FlatList
        data={groupedAchievements}
        keyExtractor={(__, index) => `group-${index}`}
        renderItem={({item}) => (
          <View style={stylesMedalBox.renderItemContainer}>
            {item.map((ac, index) => (
              <View
                style={stylesMedalBox.mapRenderItem}
                key={ac.name + '_' + index}>
                {renderMedalCard(ac)}
              </View>
            ))}
          </View>
        )}
        showsVerticalScrollIndicator={false}
        pagingEnabled
        nestedScrollEnabled
        ListEmptyComponent={EmptyMedalList}
      />
    </View>
  );
}

interface CarouselProps {
  user: any;
}
export default function Carousel({user}: CarouselProps) {
  const components = [
    <ProfileStatusBox user={user} key="profile-status" />,
    <MedalBox user={user} key="medal-box" />,
  ];

  return (
    <View style={stylesCarousel.container}>
      <FlatList
        data={components}
        keyExtractor={(__, index) => `page-${index}`}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        renderItem={item => (
          <View style={stylesCarousel.flatListContainer}>{item.item}</View>
        )}
      />
    </View>
  );
}
