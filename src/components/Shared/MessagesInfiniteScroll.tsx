/* eslint-disable react-hooks/exhaustive-deps */

import { LoaderCircle } from "lucide-react";
import { RefObject, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useInView } from "react-intersection-observer";
import axiosClient, { TResponse } from "@/lib/axios";
import { useQueryClient } from "@tanstack/react-query";

type TProps = {
  containerRef: RefObject<HTMLDivElement>;
};

const MessagesInfiniteScroll = ({ containerRef }: TProps) => {
  const [page, setPage] = useState(1);
  const [isNext, setIsNext] = useState(true);
  const [loading, setLoading] = useState(false);

  const { id } = useParams(); // Conversation Id

  const fetchMoreMessages = async () => {
    if (loading || !isNext) return;
    setPage((prev) => prev + 1);
  };

  const queryClient = useQueryClient();

  const fetchNewMessages = async () => {
    setLoading(true);

    try {
      // Save the current scroll position
      const container = containerRef.current;
      const distanceFromBottom = container
        ? container.scrollHeight - container.scrollTop
        : 0;

      const response = (await axiosClient.get(`/message/${id}`, {
        params: { page: `${page}` },
      })) as TResponse;

      setIsNext(response?.data?.isNext || false);

      if (response?.data?.messages?.length !== 0) {
        queryClient.setQueryData(["messages", id], (oldData: any) => ({
          ...oldData,
          data: {
            messages: [
              ...(oldData?.data?.messages || []),
              ...(response?.data?.messages || []),
            ],
            isNext: response?.data?.isNext,
            page: response?.data?.page,
          },
        }));
      }

      // Adjust scroll position based on the difference in scroll height
      if (container) {
        setTimeout(() => {
          const newScrollHeight = container.scrollHeight;
          container.scrollTop = newScrollHeight - distanceFromBottom;
        }, 1);
      }
    } catch (error: any) {
      console.log("could not fetch messages");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const { ref, inView } = useInView();

  useEffect(() => {
    if (page > 1) {
      fetchNewMessages();
    }
  }, [page]);

  useEffect(() => {
    if (inView && isNext) {
      const timeout = setTimeout(() => {
        fetchMoreMessages();
      }, 500);

      return () => clearTimeout(timeout);
    }
  }, [inView]);
  return (
    <div>
      {isNext && (
        <div className="flex justify-center mb-5" ref={ref}>
          <LoaderCircle className="size-8 text-blue-500 animate-spin" />
        </div>
      )}
    </div>
  );
};

export default MessagesInfiniteScroll;
