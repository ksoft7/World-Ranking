const Spinner = () => {
  return (
    <div className="flex justify-center items-center py-20">
      <div
        className="w-12 h-12 border-4 border-[#3a3d42] border-t-[#d2d5da] rounded-full animate-spin"
        role="status"
      ></div>
    </div>
  );
};

export default Spinner;
