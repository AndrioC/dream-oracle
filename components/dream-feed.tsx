'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import {
  MessageCircle,
  Heart,
  Expand,
  X,
  Edit,
  Trash,
  Loader2,
} from 'lucide-react';
import Image from 'next/image';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  InfiniteData,
  UseMutationResult,
  useQueryClient,
  useMutation,
} from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import axios, { AxiosError } from 'axios';

type User = {
  id: number;
  name: string | null;
  email: string | null;
  image: string | null;
};

type DreamLike = {
  id: number;
  userId: number;
};

type DreamComment = {
  id: number;
  userId: number;
  content: string;
  createdAt: string;
  user: {
    id: number;
    name: string | null;
    image: string | null;
  };
};

type Dream = {
  id: number;
  title: string;
  description: string;
  date: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  userId: number;
  interpretation: string | null;
  imageUrl: string | null;
  imageStyle: string | null;
  user: User | null;
  likes: DreamLike[];
  comments: DreamComment[];
};

type DreamsResponse = {
  dreams: Dream[];
  totalPages: number;
  currentPage: number;
};

type DreamFeedProps = {
  data: InfiniteData<DreamsResponse> | undefined;
  fetchNextPage: () => void;
  hasNextPage: boolean | undefined;
  isFetchingNextPage: boolean;
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
};

type MutationError = AxiosError | Error | null;

export default function DreamFeed({
  data,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  isLoading,
  isError,
  refetch,
}: DreamFeedProps) {
  const t = useTranslations('dreamFeed');
  const queryClient = useQueryClient();
  const [imageLoading, setImageLoading] = useState<{ [key: number]: boolean }>(
    {}
  );
  const [expandedImageLoading, setExpandedImageLoading] = useState(true);
  const observerTarget = useRef<HTMLDivElement>(null);
  const [newComment, setNewComment] = useState<string>('');
  const [editingComment, setEditingComment] = useState<{
    id: number;
    content: string;
  } | null>(null);
  const [actionLoading, setActionLoading] = useState<{
    [key: string]: boolean;
  }>({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 1.0 }
    );

    const currentObserverTarget = observerTarget.current;

    if (currentObserverTarget) {
      observer.observe(currentObserverTarget);
    }

    return () => {
      if (currentObserverTarget) {
        observer.unobserve(currentObserverTarget);
      }
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const likeMutation = useMutation<void, MutationError, number>({
    mutationFn: (dreamId: number) => axios.post('/api/dream/like', { dreamId }),
    onMutate: (dreamId) => {
      setActionLoading((prev) => ({ ...prev, [`like-${dreamId}`]: true }));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      refetch();
    },
    onError: (error) => {
      console.error('Error liking dream:', error);
    },
    onSettled: (_, __, dreamId) => {
      setActionLoading((prev) => ({ ...prev, [`like-${dreamId}`]: false }));
    },
  });

  const commentMutation = useMutation<
    void,
    MutationError,
    { dreamId: number; content: string }
  >({
    mutationFn: ({ dreamId, content }) =>
      axios.post('/api/dream/comment/create', { dreamId, content }),
    onMutate: (variables) => {
      setActionLoading((prev) => ({
        ...prev,
        [`comment-${variables.dreamId}`]: true,
      }));
    },
    onSuccess: () => {
      setNewComment('');
      refetch();
    },
    onError: (error) => {
      console.error('Error commenting on dream:', error);
    },
    onSettled: (_, __, variables) => {
      setActionLoading((prev) => ({
        ...prev,
        [`comment-${variables.dreamId}`]: false,
      }));
    },
  });

  const editCommentMutation = useMutation<
    void,
    MutationError,
    { commentId: number; content: string }
  >({
    mutationFn: ({ commentId, content }) =>
      axios.put('/api/dream/comment/update', { commentId, content }),
    onMutate: (variables) => {
      setActionLoading((prev) => ({
        ...prev,
        [`edit-${variables.commentId}`]: true,
      }));
    },
    onSuccess: () => {
      setEditingComment(null);
      refetch();
    },
    onError: (error) => {
      console.error('Error updating comment:', error);
    },
    onSettled: (_, __, variables) => {
      setActionLoading((prev) => ({
        ...prev,
        [`edit-${variables.commentId}`]: false,
      }));
    },
  });

  const deleteCommentMutation = useMutation<void, MutationError, number>({
    mutationFn: (commentId: number) =>
      axios.delete('/api/dream/comment/remove', { data: { commentId } }),
    onMutate: (commentId) => {
      setActionLoading((prev) => ({ ...prev, [`delete-${commentId}`]: true }));
    },
    onSuccess: () => {
      refetch();
    },
    onError: (error) => {
      console.error('Error deleting comment:', error);
    },
    onSettled: (_, __, commentId) => {
      setActionLoading((prev) => ({ ...prev, [`delete-${commentId}`]: false }));
    },
  });

  if (isLoading) return <LoadingIndicator message={t('loading')} />;
  if (isError) return <ErrorMessage message={t('error')} />;

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      <AnimatePresence>
        {data?.pages.map((page, pageIndex) => (
          <React.Fragment key={pageIndex}>
            {page.dreams.map((dream) => (
              <DreamCard
                key={dream.id}
                dream={dream}
                t={t}
                imageLoading={imageLoading}
                setImageLoading={setImageLoading}
                expandedImageLoading={expandedImageLoading}
                setExpandedImageLoading={setExpandedImageLoading}
                actionLoading={actionLoading}
                likeMutation={likeMutation}
                commentMutation={commentMutation}
                editCommentMutation={editCommentMutation}
                deleteCommentMutation={deleteCommentMutation}
                newComment={newComment}
                setNewComment={setNewComment}
                editingComment={editingComment}
                setEditingComment={setEditingComment}
              />
            ))}
          </React.Fragment>
        ))}
      </AnimatePresence>
      {isFetchingNextPage && <LoadingIndicator message={t('loadingMore')} />}
      <div ref={observerTarget} />
    </div>
  );
}

type DreamCardProps = {
  dream: Dream;
  t: (key: string) => string;
  imageLoading: { [key: number]: boolean };
  setImageLoading: React.Dispatch<
    React.SetStateAction<{ [key: number]: boolean }>
  >;
  expandedImageLoading: boolean;
  setExpandedImageLoading: React.Dispatch<React.SetStateAction<boolean>>;
  actionLoading: { [key: string]: boolean };
  likeMutation: UseMutationResult<void, MutationError, number>;
  commentMutation: UseMutationResult<
    void,
    MutationError,
    { dreamId: number; content: string }
  >;
  editCommentMutation: UseMutationResult<
    void,
    MutationError,
    { commentId: number; content: string }
  >;
  deleteCommentMutation: UseMutationResult<void, MutationError, number>;
  newComment: string;
  setNewComment: React.Dispatch<React.SetStateAction<string>>;
  editingComment: { id: number; content: string } | null;
  setEditingComment: React.Dispatch<
    React.SetStateAction<{ id: number; content: string } | null>
  >;
};

const DreamCard = ({
  dream,
  t,
  imageLoading,
  setImageLoading,
  expandedImageLoading,
  setExpandedImageLoading,
  actionLoading,
  likeMutation,
  commentMutation,
  editCommentMutation,
  deleteCommentMutation,
  newComment,
  setNewComment,
  editingComment,
  setEditingComment,
}: DreamCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -50 }}
    transition={{ duration: 0.5 }}
  >
    <Card className="overflow-hidden bg-card shadow-md dark:shadow-zinc-800">
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar>
          <AvatarImage
            src={dream.user?.image || '/placeholder-user.jpg'}
            alt={dream.user?.name || t('anonymous')}
          />
          <AvatarFallback>
            {dream.user?.name ? dream.user.name[0] : 'U'}
          </AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-xl font-semibold text-foreground">
            {dream.title}
          </h2>
          <p className="text-sm text-muted-foreground">
            {t('by')} {dream.user?.name || t('anonymous')}
          </p>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {dream.imageUrl && (
          <DreamImage
            dream={dream}
            imageLoading={imageLoading}
            setImageLoading={setImageLoading}
            expandedImageLoading={expandedImageLoading}
            setExpandedImageLoading={setExpandedImageLoading}
            t={t}
          />
        )}
        <AutoResizeTextarea
          value={dream.description}
          className="w-full resize-none bg-background text-foreground"
        />
        {dream.interpretation && (
          <AutoResizeTextarea
            value={dream.interpretation}
            className="w-full resize-none bg-secondary text-secondary-foreground"
          />
        )}
      </CardContent>
      <CardFooter className="flex justify-between bg-muted/50">
        <LikeButton
          dreamId={dream.id}
          likes={dream.likes}
          actionLoading={actionLoading}
          likeMutation={likeMutation}
        />
        <CommentButton commentsCount={dream.comments.length} />
      </CardFooter>
      <CommentSection
        dreamId={dream.id}
        comments={dream.comments}
        newComment={newComment}
        setNewComment={setNewComment}
        actionLoading={actionLoading}
        commentMutation={commentMutation}
        editCommentMutation={editCommentMutation}
        deleteCommentMutation={deleteCommentMutation}
        editingComment={editingComment}
        setEditingComment={setEditingComment}
        t={t}
      />
    </Card>
  </motion.div>
);

type DreamImageProps = {
  dream: Dream;
  imageLoading: { [key: number]: boolean };
  setImageLoading: React.Dispatch<
    React.SetStateAction<{ [key: number]: boolean }>
  >;
  expandedImageLoading: boolean;
  setExpandedImageLoading: React.Dispatch<React.SetStateAction<boolean>>;
  t: (key: string) => string;
};

const DreamImage = ({
  dream,
  imageLoading,
  setImageLoading,
  expandedImageLoading,
  setExpandedImageLoading,
  t,
}: DreamImageProps) => (
  <div className="relative">
    <Image
      src={dream.imageUrl || ''}
      alt={dream.title}
      width={400}
      height={300}
      className={`w-full h-64 object-cover rounded-md transition-opacity duration-300 ${
        imageLoading[dream.id] ? 'opacity-0' : 'opacity-100'
      }`}
      placeholder="blur"
      blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/+F9PQAI/wM6hgbIWgAAAABJRU5ErkJggg=="
      onLoadingComplete={() =>
        setImageLoading((prev) => ({ ...prev, [dream.id]: false }))
      }
      onLoadStart={() =>
        setImageLoading((prev) => ({ ...prev, [dream.id]: true }))
      }
    />
    {imageLoading[dream.id] && (
      <div className="absolute inset-0 flex items-center justify-center bg-muted/50 backdrop-blur-sm rounded-md">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )}
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="absolute bottom-2 right-2"
        >
          <Expand className="h-4 w-4" />
          <span className="sr-only">{t('expand')}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[45vw] max-h-[100vh] sm:w-4/5 sm:h-4/5 flex items-center justify-center p-4">
        <div className="relative w-full h-full min-h-[300px] flex items-center justify-center">
          {expandedImageLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted/80 backdrop-blur-sm rounded-md">
              <Loader2 className="h-16 w-16 animate-spin mb-4" />
              <p className="text-sm text-muted-foreground">
                {t('loadingImage')}
              </p>
            </div>
          )}
          <Image
            src={dream.imageUrl || ''}
            alt={dream.title}
            fill
            onLoadingComplete={() => setExpandedImageLoading(false)}
            onLoad={() => setExpandedImageLoading(false)}
            onError={() => setExpandedImageLoading(false)}
          />
        </div>
        <DialogClose className="absolute top-2 right-2 rounded-full bg-background p-2 hover:bg-muted">
          <X className="h-4 w-4" />
          <span className="sr-only">{t('close')}</span>
        </DialogClose>
      </DialogContent>
    </Dialog>
  </div>
);

type LikeButtonProps = {
  dreamId: number;
  likes: DreamLike[];
  actionLoading: { [key: string]: boolean };
  likeMutation: UseMutationResult<void, MutationError, number>;
};

const LikeButton = ({
  dreamId,
  likes,
  actionLoading,
  likeMutation,
}: LikeButtonProps) => (
  <Button
    variant="ghost"
    onClick={() => likeMutation.mutate(dreamId)}
    disabled={actionLoading[`like-${dreamId}`]}
    className="transition-all duration-300 ease-in-out hover:bg-primary/10 dark:hover:bg-primary/20 mt-3"
  >
    {actionLoading[`like-${dreamId}`] ? (
      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
    ) : (
      <Heart
        className={`mr-2 h-4 w-4 transition-colors
          ${
            likes.length > 0
              ? 'fill-purple-500 text-purple-500'
              : 'fill-none text-muted-foreground group-hover:text-purple-500'
          }`}
      />
    )}
    {likes.length}
  </Button>
);

type CommentButtonProps = {
  commentsCount: number;
};

const CommentButton = ({ commentsCount }: CommentButtonProps) => (
  <Button
    variant="ghost"
    className="transition-all duration-300 ease-in-out hover:bg-primary/10 dark:hover:bg-primary/20 mt-3"
  >
    <MessageCircle className="mr-2 h-4 w-4" />
    {commentsCount}
  </Button>
);

type CommentSectionProps = {
  dreamId: number;
  comments: DreamComment[];
  newComment: string;
  setNewComment: React.Dispatch<React.SetStateAction<string>>;
  actionLoading: { [key: string]: boolean };
  commentMutation: UseMutationResult<
    void,
    MutationError,
    { dreamId: number; content: string }
  >;
  editCommentMutation: UseMutationResult<
    void,
    MutationError,
    { commentId: number; content: string }
  >;
  deleteCommentMutation: UseMutationResult<void, MutationError, number>;
  editingComment: { id: number; content: string } | null;
  setEditingComment: React.Dispatch<
    React.SetStateAction<{ id: number; content: string } | null>
  >;
  t: (key: string) => string;
};

const CommentSection = ({
  dreamId,
  comments,
  newComment,
  setNewComment,
  actionLoading,
  commentMutation,
  editCommentMutation,
  deleteCommentMutation,
  editingComment,
  setEditingComment,
  t,
}: CommentSectionProps) => (
  <div className="p-4 bg-background dark:bg-zinc-800">
    <div className="flex items-start space-x-2 mb-4">
      <Avatar className="w-8 h-8">
        <AvatarImage src="/placeholder-user.jpg" alt="Current user" />
        <AvatarFallback>U</AvatarFallback>
      </Avatar>
      <div className="flex-grow">
        <Textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder={t('addComment')}
          className="mb-2 resize-none"
          rows={1}
        />
        <Button
          onClick={() =>
            commentMutation.mutate({ dreamId, content: newComment })
          }
          disabled={actionLoading[`comment-${dreamId}`]}
          className="transition-all duration-300 ease-in-out"
        >
          {actionLoading[`comment-${dreamId}`] ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            t('postComment')
          )}
        </Button>
      </div>
    </div>
    <AnimatePresence>
      {comments.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          editingComment={editingComment}
          setEditingComment={setEditingComment}
          actionLoading={actionLoading}
          editCommentMutation={editCommentMutation}
          deleteCommentMutation={deleteCommentMutation}
          t={t}
        />
      ))}
    </AnimatePresence>
  </div>
);

type CommentItemProps = {
  comment: DreamComment;
  editingComment: { id: number; content: string } | null;
  setEditingComment: React.Dispatch<
    React.SetStateAction<{ id: number; content: string } | null>
  >;
  actionLoading: { [key: string]: boolean };
  editCommentMutation: UseMutationResult<
    void,
    MutationError,
    { commentId: number; content: string }
  >;
  deleteCommentMutation: UseMutationResult<void, MutationError, number>;
  t: (key: string) => string;
};

const CommentItem = ({
  comment,
  editingComment,
  setEditingComment,
  actionLoading,
  editCommentMutation,
  deleteCommentMutation,
  t,
}: CommentItemProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3 }}
    className="mt-2 p-2 bg-secondary dark:bg-zinc-700 rounded flex items-start space-x-2"
  >
    <Avatar className="w-8 h-8">
      <AvatarImage
        src={comment.user.image || '/placeholder-user.jpg'}
        alt={comment.user.name || 'User'}
      />
      <AvatarFallback>
        {comment.user.name ? comment.user.name[0] : 'U'}
      </AvatarFallback>
    </Avatar>
    <div className="flex-grow">
      {editingComment?.id === comment.id ? (
        <EditingCommentForm
          editingComment={editingComment}
          setEditingComment={setEditingComment}
          actionLoading={actionLoading}
          editCommentMutation={editCommentMutation}
          t={t}
        />
      ) : (
        <DisplayedComment
          comment={comment}
          setEditingComment={setEditingComment}
          actionLoading={actionLoading}
          deleteCommentMutation={deleteCommentMutation}
          t={t}
        />
      )}
    </div>
  </motion.div>
);

type EditingCommentFormProps = {
  editingComment: { id: number; content: string };
  setEditingComment: React.Dispatch<
    React.SetStateAction<{ id: number; content: string } | null>
  >;
  actionLoading: { [key: string]: boolean };
  editCommentMutation: UseMutationResult<
    void,
    MutationError,
    { commentId: number; content: string }
  >;
  t: (key: string) => string;
};

const EditingCommentForm = ({
  editingComment,
  setEditingComment,
  actionLoading,
  editCommentMutation,
  t,
}: EditingCommentFormProps) => (
  <>
    <Textarea
      value={editingComment.content}
      onChange={(e) =>
        setEditingComment({ ...editingComment, content: e.target.value })
      }
      className="mb-2 resize-none"
      rows={2}
    />
    <div className="space-x-2">
      <Button
        onClick={() =>
          editCommentMutation.mutate({
            commentId: editingComment.id,
            content: editingComment.content,
          })
        }
        disabled={actionLoading[`edit-${editingComment.id}`]}
        size="sm"
        className="transition-all duration-300 ease-in-out"
      >
        {actionLoading[`edit-${editingComment.id}`] ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          t('saveEdit')
        )}
      </Button>
      <Button
        variant="ghost"
        onClick={() => setEditingComment(null)}
        size="sm"
        className="transition-all duration-300 ease-in-out"
      >
        {t('cancelEdit')}
      </Button>
    </div>
  </>
);

type DisplayedCommentProps = {
  comment: DreamComment;
  setEditingComment: React.Dispatch<
    React.SetStateAction<{ id: number; content: string } | null>
  >;
  actionLoading: { [key: string]: boolean };
  deleteCommentMutation: UseMutationResult<void, MutationError, number>;
  t: (key: string) => string;
};

const DisplayedComment = ({
  comment,
  setEditingComment,
  actionLoading,
  deleteCommentMutation,
}: DisplayedCommentProps) => (
  <>
    <p className="text-sm">{comment.content}</p>
    <div className="flex justify-between items-center mt-1">
      <small className="text-xs text-muted-foreground">
        {comment.user.name} • {new Date(comment.createdAt).toLocaleDateString()}
      </small>
      <div className="space-x-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={() =>
            setEditingComment({ id: comment.id, content: comment.content })
          }
          className="transition-all duration-300 ease-in-out hover:bg-primary/10 dark:hover:bg-primary/20"
        >
          <Edit className="h-3 w-3" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => deleteCommentMutation.mutate(comment.id)}
          disabled={actionLoading[`delete-${comment.id}`]}
          className="transition-all duration-300 ease-in-out hover:bg-destructive/10 dark:hover:bg-destructive/20"
        >
          {actionLoading[`delete-${comment.id}`] ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : (
            <Trash className="h-3 w-3" />
          )}
        </Button>
      </div>
    </div>
  </>
);

type AutoResizeTextareaProps = {
  value: string;
  className: string;
};

const AutoResizeTextarea = ({ value, className }: AutoResizeTextareaProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [value]);

  return (
    <Textarea
      ref={textareaRef}
      readOnly
      value={value}
      className={`${className} overflow-hidden`}
    />
  );
};

type LoadingIndicatorProps = {
  message: string;
};

const LoadingIndicator = ({ message }: LoadingIndicatorProps) => (
  <div className="text-center py-4 text-foreground">
    <Loader2 className="h-6 w-6 animate-spin inline-block mr-2" />
    {message}
  </div>
);

type ErrorMessageProps = {
  message: string;
};

const ErrorMessage = ({ message }: ErrorMessageProps) => (
  <div className="text-center py-8 text-destructive">{message}</div>
);
