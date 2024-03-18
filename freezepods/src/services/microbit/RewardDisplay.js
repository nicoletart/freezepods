import React from 'react';

const RewardDisplay = ({ score, reward }) => {
  const [rewardText, setRewardText] = React.useState("");

  React.useEffect(() => {
    setRewardText(`+${reward}`);
    setTimeout(() => setRewardText(""), 900);
  }, [score, reward]);

  return <div>{rewardText}</div>;
};

export default RewardDisplay;
