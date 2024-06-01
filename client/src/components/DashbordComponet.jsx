import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import {
  HiAnnotation,
  HiArrowNarrowUp,
  HiDocumentText,
  HiOutlineUserGroup,
} from "react-icons/hi";
import { Button, Table } from "flowbite-react";
import { Link } from "react-router-dom";

export default function DashboardComp() {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

  const [users, setUsers] = useState([]);
  const [comments, setComments] = useState([]);
  const [posts, setPosts] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPosts, setTotalPosts] = useState(0);
  const [totalComments, setTotalComments] = useState(0);
  const [lastMonthUsers, setLastMonthUsers] = useState(0);
  const [lastMonthPosts, setLastMonthPosts] = useState(0);
  const [lastMonthComments, setLastMonthComments] = useState(0);
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/user/getusers?limit=5`);
        const data = await res.json();
        if (res.ok) {
          setUsers(data.users);
          setTotalUsers(data.totalUsers);
          setLastMonthUsers(data.lastMonthUsers);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    const fetchPosts = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/post/getposts?limit=5`);
        const data = await res.json();
        if (res.ok) {
          setPosts(data.posts);
          setTotalPosts(data.totalPosts);
          setLastMonthPosts(data.lastMonthPosts);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    const fetchComments = async () => {
      try {
        const res = await fetch(
          `${API_BASE_URL}/api/comment/getcomments?limit=5`
        );
        const data = await res.json();
        if (res.ok) {
          setComments(data.comments);
          setTotalComments(data.totalComments);
          setLastMonthComments(data.lastMonthComments);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    if (currentUser.isAdmin) {
      fetchUsers();
      fetchPosts();
      fetchComments();
    }
  }, [currentUser, API_BASE_URL]);

  return (
    <div className="p-3 md:mx-auto">
      <div className="flex-wrap flex gap-4 justify-center">
        <DashboardCard
          title="Total Users"
          total={totalUsers}
          lastMonth={lastMonthUsers}
          icon={
            <HiOutlineUserGroup className="bg-teal-600 text-white rounded-full text-5xl p-3 shadow-lg" />
          }
        />
        <DashboardCard
          title="Total Comments"
          total={totalComments}
          lastMonth={lastMonthComments}
          icon={
            <HiAnnotation className="bg-indigo-600 text-white rounded-full text-5xl p-3 shadow-lg" />
          }
        />
        <DashboardCard
          title="Total Posts"
          total={totalPosts}
          lastMonth={lastMonthPosts}
          icon={
            <HiDocumentText className="bg-lime-600 text-white rounded-full text-5xl p-3 shadow-lg" />
          }
        />
      </div>
      <div className="flex flex-wrap gap-4 py-3 mx-auto justify-center">
        <RecentTable
          title="Recent Users"
          data={users}
          columns={[
            {
              label: "User image",
              key: "photo",
              render: (user) => (
                <img
                  src={user.userProfileImg}
                  alt="user"
                  className="w-10 h-10 rounded-full bg-gray-500"
                />
              ),
            },
            { label: "Username", key: "username" },
          ]}
          link="/dashboard?tab=users"
        />
        <RecentTable
          title="Recent Comments"
          data={comments}
          columns={[
            {
              label: "Comment content",
              key: "content",
              render: (comment) => (
                <p className="line-clamp-2">{comment.content}</p>
              ),
            },
            { label: "Likes", key: "numberOfLikes" },
          ]}
          link="/dashboard?tab=comments"
        />
        <RecentTable
          title="Recent Posts"
          data={posts}
          columns={[
            {
              label: "Post image",
              key: "image",
              render: (post) => (
                <img
                  src={post.image}
                  alt="post"
                  className="w-14 h-10 rounded-md bg-gray-500"
                />
              ),
            },
            { label: "Post Title", key: "title" },
            { label: "Category", key: "category" },
          ]}
          link="/dashboard?tab=posts"
        />
      </div>
    </div>
  );
}

function DashboardCard({ title, total, lastMonth, icon }) {
  return (
    <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md">
      <div className="flex justify-between">
        <div className="">
          <h3 className="text-gray-500 text-md uppercase">{title}</h3>
          <p className="text-2xl">{total}</p>
        </div>
        {icon}
      </div>
      <div className="flex gap-2 text-sm">
        <span className="text-green-500 flex items-center">
          <HiArrowNarrowUp />
          {lastMonth}
        </span>
        <div className="text-gray-500">Last month</div>
      </div>
    </div>
  );
}

DashboardCard.propTypes = {
  title: PropTypes.string.isRequired,
  total: PropTypes.number.isRequired,
  lastMonth: PropTypes.number.isRequired,
  icon: PropTypes.node.isRequired,
};

function RecentTable({ title, data, columns, link }) {
  return (
    <div className="flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800">
      <div className="flex justify-between p-3 text-sm font-semibold">
        <h1 className="text-center p-2">{title}</h1>
        <Button outline gradientDuoTone="purpleToPink">
          <Link to={link}>See all</Link>
        </Button>
      </div>
      <Table hoverable>
        <Table.Head>
          {columns.map((col) => (
            <Table.HeadCell key={col.key}>{col.label}</Table.HeadCell>
          ))}
        </Table.Head>
        {data &&
          data.map((item) => (
            <Table.Body key={item._id} className="divide-y">
              <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                {columns.map((col) => (
                  <Table.Cell
                    key={col.key}
                    className={col.key === "content" ? "w-96" : ""}
                  >
                    {col.render ? col.render(item) : item[col.key]}
                  </Table.Cell>
                ))}
              </Table.Row>
            </Table.Body>
          ))}
      </Table>
    </div>
  );
}

RecentTable.propTypes = {
  title: PropTypes.string.isRequired,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      key: PropTypes.string.isRequired,
      render: PropTypes.func,
    })
  ).isRequired,
  link: PropTypes.string.isRequired,
};
