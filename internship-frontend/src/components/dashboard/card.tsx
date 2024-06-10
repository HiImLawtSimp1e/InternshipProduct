import { MdSupervisedUserCircle } from "react-icons/md";

interface CardProps {
  item: {
    title: string;
    number: number;
    change: number;
  };
}

const Card: React.FC<CardProps> = ({ item }) => {
  return (
    <div className="px-4 py-5 bg-[#182237] rounded-lg flex gap-4 cursor-pointer w-full hover:bg-gray-600">
      <MdSupervisedUserCircle size={24} />
      <div className="flex flex-col gap-4">
        <span className="text-white">{item.title}</span>
        <span className="text-xl font-medium text-white">{item.number}</span>
        <span className="text-sm font-light text-white">
          <span className={item.change > 0 ? "text-lime-500" : "text-red-500"}>
            {item.change}%
          </span>
          {item.change > 0 ? "more" : "less"} than previous week
        </span>
      </div>
    </div>
  );
};

export default Card;
