import { useDispatch, useSelector } from "react-redux";
import { GetResults } from "../Services/api.service";
import {
  setData,
  setError,
  setLoading,
  setPage,
  resetFlow,
} from "../Slices/homeSlice";

export const useRepo = () => {
  const dispatch = useDispatch();
  const state = useSelector((state) => state.repo);
  const analyzeRepo = async (repoUrl) => {
    try {
      dispatch(setLoading(true));
      const data = await GetResults({ repoUrl });
      dispatch(setData(data));
      dispatch(setPage("result"));
      dispatch(setError(null));
    } catch (err) {
      dispatch(
        setError(
          err.message || "Something went wrong during analyzing your repo",
        ),
      );
    } finally {
      dispatch(setLoading(false));
    }
  };
  return {
    ...state,
    analyzeRepo,

    resetFlow: () => dispatch(resetFlow()),
  };
};
