import { useEffect, useState } from "react";
import AnimationWrapper from "../common/Page-animation";
import Loader from "../components/ui/Loader";
import NoDataMessage from "../components/ui/NoData";
import NotificationCard from "../components/notification-card.component";
import LoadMoreDataBtn from "../components/Blogs/LoadMoreDataBtn";
import { filterPaginationData } from "../common/FilteredPaginationData";
import api from "../utils/api";

const FILTERS = ["all", "like", "comment", "reply"];

const NotificationsPage = () => {
  const [filter, setFilter] = useState("all");
  const [notifications, setNotifications] = useState(null);

  const fetchNotifications = async ({ page = 1, deletedDocCount = 0 } = {}) => {
    try {
      const { data } = await api.get("/notifications", {
        params: { page, filter },
      });

      const formatted = await filterPaginationData({
        create_new_arr: page === 1,
        state: notifications,
        data: data.notifications,
        page,
        countRoute: "/notifications/count",
        data_to_send: { filter },
      });

      // Mark as seen locally
      formatted.results = formatted.results.map((n) => ({ ...n, seen: true }));
      setNotifications(formatted);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    setNotifications(null);
    fetchNotifications({ page: 1 });
  }, [filter]);

  return (
    <div>
      <h1 className="max-md:hidden text-2xl font-medium mb-8">Notifications</h1>

      {/* Filter tabs */}
      <div className="my-8 flex gap-6 flex-wrap">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={
              "py-2 capitalize " +
              (filter === f ? "btn-dark" : "btn-light")
            }
          >
            {f}
          </button>
        ))}
      </div>

      {notifications == null ? (
        <Loader />
      ) : notifications.results.length ? (
        <>
          <AnimationWrapper>
            {notifications.results.map((notification, i) => (
              <AnimationWrapper key={i} transition={{ delay: i * 0.04 }}>
                <NotificationCard
                  data={notification}
                  index={i}
                  notificationState={{ notifications, setNotifications }}
                />
              </AnimationWrapper>
            ))}
          </AnimationWrapper>

          <LoadMoreDataBtn
            state={notifications}
            fetchData={fetchNotifications}
          />
        </>
      ) : (
        <NoDataMessage message={`No ${filter === "all" ? "" : filter} notifications`} />
      )}
    </div>
  );
};

export default NotificationsPage;