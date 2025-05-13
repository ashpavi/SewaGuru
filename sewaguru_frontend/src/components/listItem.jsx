import { format } from 'date-fns';

const ListItem = ({ imageUrl, name, registeredOn, onAccept, onDeny, disabled, onClick }) => {
  const formattedDate = format(new Date(registeredOn), 'yyyy-MMM-dd hh:mm:ss a');

  // Class names for the ListItem when disabled
  const disabledClass =  disabled === true ? 'bg-red-100 border-red-500 text-gray-500 hover:bg-red-200' : 'bg-gray-100 hover:bg-gray-200';

  return (
    <li onClick={onClick}
      className={`flex items-center justify-between h-10 px-4 rounded-lg shadow-sm transition ${disabledClass}`}
    >
      <div className="flex items-center space-x-3 h-full">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            className="w-8 h-8 rounded-full object-cover border"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center text-white">
            <span className="text-xl">{name.charAt(0)}</span>
          </div>
        )}
        <div className="leading-tight">
          <p className="text-sm font-medium text-gray-800 truncate">{name}</p>
          <p className="text-[10px] text-gray-400 truncate">
            Registered on {formattedDate}
          </p>
        </div>
      </div>
      <div className="flex items-center space-x-1">
        {disabled !== false && (
          <button
            onClick={(e) => { e.stopPropagation(); onAccept(); }}
            className={`p-2 rounded-full text-sm font-medium ${disabled !== true ? "text-gray-300 cursor-not-allowed" : "text-green-500 hover:bg-green-100"}`}
          >
            Enable
          </button>
        )}
        {disabled !== true && (
          <button
            onClick={(e) => { e.stopPropagation(); onDeny(); }}
            className={`p-2 rounded-full text-sm font-medium ${disabled !== false ? "text-gray-300 cursor-not-allowed" : "text-red-500 hover:bg-red-100"}`}
          >
            Disable
          </button>
        )}
      </div>
    </li>
  );
};

export default ListItem;
