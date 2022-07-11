import React from 'react';
import {storiesOf} from '@storybook/react-native';
import SbContainer from 'storybook/decorators/SbContainer';
import UserBio from 'screens/Profile/components/UserBio/index';

const DUMMY_CONTENT = ` Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed finibus orci porta, finibus lacus quis, facilisis metus. Nam aliquet rhoncus ullamcorper. Aenean sit amet auctor dolor, porttitor faucibus ex. Quisque neque lectus, auctor feugiat fringilla sit amet, lacinia ut urna. Duis iaculis ex sit amet luctus consequat. Ut blandit est in vestibulum maximus. Phasellus porttitor maximus orci, eu tincidunt sem tristique sed.

Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Donec id auctor quam. Interdum et malesuada fames ac ante ipsum primis in faucibus. Cras non accumsan turpis. Sed a viverra felis, eu tincidunt tellus. In lacinia orci risus, ut ultrices tortor hendrerit id. Nam scelerisque semper libero volutpat venenatis. Nullam commodo ex vitae venenatis dignissim.

Duis eget finibus mi. In imperdiet est at arcu vehicula, tempus volutpat sem congue. Praesent a egestas erat. Nulla sed convallis eros. Sed velit eros, ullamcorper egestas consequat at, consequat eget enim. Nulla ultricies ex mattis, aliquam neque id, lacinia enim. Praesent quis lobortis libero, ut blandit ligula. Nullam tristique quis purus quis gravida. Sed vel nulla rutrum diam gravida fringilla eu eu mi. Pellentesque non viverra nisi, vitae consequat mauris. Nam pellentesque feugiat lacus, non molestie nunc ornare id. Suspendisse vehicula nunc nec rutrum volutpat. Mauris fermentum velit vitae turpis venenatis, ac bibendum nisl ultrices. 
`;

storiesOf('components/UserBio', module)
  .addDecorator(s => (
    <SbContainer padding={16} justifyContent="center" alignItems="center">
      {s()}
    </SbContainer>
  ))
  .add('default', () => <UserBio content={DUMMY_CONTENT} />)
  .add('with empty content', () => <UserBio content="" />);
