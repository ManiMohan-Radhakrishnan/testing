import { useState } from "react";
import { useHistory } from "react-router-dom";
import { HiExternalLink } from "react-icons/hi";
import dayjs from "dayjs";

import { userActivityApi } from "../../../api/methods";
import useEffectOnce from "../../../hooks/useEffectOnce";

const RecentActivitiesCard = () => {
  const history = useHistory();
  const [activities, setActivities] = useState([]);

  const fetchUserActivities = async () => {
    try {
      const response = await userActivityApi(1, []);
      setActivities(response.data.data.nfts);
    } catch (error) {
      console.error(`Error in fetching user activities`, error);
    }
  };

  useEffectOnce(fetchUserActivities);

  return (
    <article className="grid-card">
      <div className="card-box  activity-card">
        <div className="card-header">
          <h4>Recent Activities </h4>
          <a onClick={() => history.push("/accounts/user-activity")}>
            View More <HiExternalLink />
          </a>
        </div>
        <div className="card-body">
          <ul className="recent-activity-list">
            {activities.map((activity, i) => (
              <li key={`activity-${i}`}>
                <h6>
                  {dayjs(activity?.created_at).format("DD MMM YYYY HH:mm A")}
                </h6>
                <h4>{activity?.title}</h4>
                <p>{activity?.desc}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </article>
  );
};

export default RecentActivitiesCard;
